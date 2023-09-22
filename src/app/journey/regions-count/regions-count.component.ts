import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RegionCount, SubRegionCount } from "src/app/country/country.model";
import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";

import { SankeyLink, SankeyNode } from "./regions-count.types";
import { fromEvent, debounceTime } from "rxjs";
import { RegionService } from "src/app/region/region.service";

@Component({
  selector: "ctg-regions-count",
  templateUrl: "./regions-count.component.html",
  styleUrls: ["./regions-count.component.scss"],
})
export class RegionsCountComponent implements OnInit, AfterViewInit {
  userRegionsCount: RegionCount[] = [];
  isMobile = window.innerWidth < 1280;

  @ViewChild("treeWrapper") treeWrapper!: ElementRef<HTMLElement>;

  constructor(private regionService: RegionService) {}

  ngOnInit(): void {
    this.regionService.getUserRegions().subscribe((userRegionsCount) => {
      this.userRegionsCount = userRegionsCount;
    });
  }

  ngAfterViewInit(): void {
    this.drawSankey();

    fromEvent(window, "resize")
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 1280;
        this.drawSankey();
      });
  }

  private drawSankey(): void {
    const containerWidth = this.treeWrapper.nativeElement.offsetWidth;
    const windowHeight = window.innerHeight;

    const svg = d3
      .select(".tree-wrapper")
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", windowHeight)
      .attr("viewBox", [0, 0, containerWidth, windowHeight])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const sankeyChart = d3Sankey
      .sankey()
      .nodeId((d: any) => d.name)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [containerWidth - 1, windowHeight - 5],
      ]);

    console.log(this.getUserRegionsAsNodes());
    console.log(this.getNodesLinks());

    const { nodes, links } = sankeyChart({
      nodes: this.getUserRegionsAsNodes().map((d) => Object.assign({}, d)) as any,
      links: this.getNodesLinks().map((d) => Object.assign({}, d)),
    });

    // Defines a color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const rect = svg
      .append("g")
      .attr("stroke", "#000")
      .selectAll()
      .data(nodes)
      .join("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("fill", (d: any) => color(d.category));

    rect.append("title").text((d: any) => `${d.name}`);

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll()
      .data(links)
      .join("g")
      .style("mix-blend-mode", "multiply");

    link
      .append("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke", (d: any) => color(d.target.category))
      .attr("stroke-width", (d: any) => Math.max(1, d.width));

    link.append("title").text((d: any) => `${d.source.name} → ${d.target.name}`);

    svg
      .append("g")
      .selectAll()
      .data(nodes)
      .join("text")
      .attr("x", (d: any) => (d.x0 < containerWidth / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", (d: any) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => (d.x0 < containerWidth / 2 ? "start" : "end"))
      .text((d: any) => d.name);
  }

  private getUserRegionsAsNodes(): SankeyNode[] {
    const nodes: SankeyNode[] = [
      {
        name: "World",
        category: "world",
      },
    ];
    this.userRegionsCount.forEach((region) => {
      nodes.push(...this.getRegionsNodes(region));
    });

    return nodes;
  }

  private getRegionsNodes(region: RegionCount): SankeyNode[] {
    const regionNode: SankeyNode = {
      name: region.name,
      category: "region",
    };
    const countriesNodes: SankeyNode[] = [];
    const subRegionsNodes: SankeyNode[] = [];

    region.intermediateRegions.forEach((intermediateRegion) => {
      intermediateRegion.subRegions.forEach((subRegion) => {
        subRegionsNodes.push({
          name: subRegion.name,
          category: "subregion",
        });

        subRegion.countriesCount.forEach((country) => {
          countriesNodes.push({
            name: country.country.name,
            category: "country",
          });
        });
      });
    });

    return [regionNode, ...countriesNodes, ...subRegionsNodes];
  }

  private getNodesLinks(): SankeyLink[] {
    const links: SankeyLink[] = [];
    this.userRegionsCount.forEach((region) => {
      links.push({
        source: "World",
        target: region.name,
        value: region.count,
      });
      links.push(...this.getRegionsLinks(region));
    });

    return links;
  }

  private getRegionsLinks(region: RegionCount): SankeyLink[] {
    const subRegionLinks: SankeyLink[] = [];
    const countryLinks: SankeyLink[] = [];

    region.intermediateRegions.forEach((intermediateRegion) => {
      intermediateRegion.subRegions.forEach((subRegion) => {
        subRegionLinks.push({
          source: region.name,
          target: subRegion.name,
          value: subRegion.count,
        });

        subRegion.countriesCount.forEach((country) => {
          countryLinks.push({
            source: subRegion.name,
            target: country.country.name,
            value: country.count,
          });
        });
      });
    });

    return [...subRegionLinks, ...countryLinks];
  }

  private getTextFontWeight(nodeDepth: number): string {
    if (nodeDepth == 0) return "800";
    if (nodeDepth == 1) return "700";
    if (nodeDepth == 2) return "600";
    return "500";
  }
}
