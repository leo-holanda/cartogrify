import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RegionCount, SubRegionCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import * as d3 from "d3";
import { TreeLeaf, TreeNode } from "./regions-count.types";
import { fromEvent, debounceTime } from "rxjs";

@Component({
  selector: "ctg-regions-count",
  templateUrl: "./regions-count.component.html",
  styleUrls: ["./regions-count.component.scss"],
})
export class RegionsCountComponent implements OnInit, AfterViewInit {
  userRegionsCount: RegionCount[] = [];
  isMobile = window.innerWidth < 1280;

  @ViewChild("treeWrapper") treeWrapper!: ElementRef<HTMLElement>;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getRegionsCount().subscribe((userRegionsCount) => {
      this.userRegionsCount = userRegionsCount;
    });
  }

  ngAfterViewInit(): void {
    this.drawTree();

    fromEvent(window, "resize")
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 1280;
        this.drawTree();
      });
  }

  private drawTree(): void {
    if (this.isMobile) this.drawVerticalTree();
    else this.drawHorizontalTree();
  }

  private drawHorizontalTree(): void {
    const treeData = this.getRegionsAsTree();
    const containerWidth = this.treeWrapper.nativeElement.offsetWidth;

    const root = d3.hierarchy(treeData);
    const nodeWidth = 40;
    //+ 2 because we need room for labels and the tree sides
    const nodeHeight = containerWidth / (root.height + 2);

    // Create a tree layout.
    const tree = d3.tree().nodeSize([nodeWidth, nodeHeight]);

    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.descending(a.data.count, b.data.count));
    tree(root as any);

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity;
    let x1 = -x0;
    root.each((d: any) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    // Compute the adjusted height of the tree.
    const height = x1 - x0 + nodeWidth * 2;

    d3.select("#tree").remove();
    const svg = d3
      .select(".tree-wrapper")
      .append("svg")
      .attr("id", "tree")
      .attr("width", containerWidth)
      .attr("height", height)
      .attr("viewBox", [-nodeHeight, x0 - nodeWidth, containerWidth, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#FAF8EF")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 2)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x) as any
      )
      .attr("stroke-width", (d: any) => d.source.height + 1);

    const node = svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr(
        "transform",
        (d) =>
          `translate(${this.isMobile ? (d as any).x : (d as any).y},${
            this.isMobile ? (d as any).y : (d as any).x
          })`
      );

    node
      .append("circle")
      .attr("fill", (d) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -6 : 6))
      .attr("text-anchor", (d) => (this.isMobile ? "middle" : d.children ? "end" : "start"))
      .text((d: any) => {
        if (d.data.country) return d.data.country.name + ` (${d.data.count})`;
        return d.data.name;
      })
      .attr("font-size", (d) => `1.${d.height}rem`)
      .style("font-weight", (d) => this.getTextFontWeight(d.depth))
      .attr("fill", "white");
  }

  private drawVerticalTree(): void {
    const treeData = this.getRegionsAsTree();
    const containerWidth = this.treeWrapper.nativeElement.offsetWidth;
    const windowHeight = window.innerHeight;

    const root = d3.hierarchy(treeData);
    const nodeHeight = windowHeight / root.height + 1;
    const tree = d3.tree().size([containerWidth, windowHeight]);

    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.descending(a.data.count, b.data.count));
    tree(root as any);

    d3.select("#tree").remove();
    const svg = d3
      .select(".tree-wrapper")
      .append("svg")
      .attr("id", "tree")
      .attr("width", containerWidth)
      .attr("height", windowHeight)
      .attr("viewBox", [0, -24, containerWidth, windowHeight + nodeHeight])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#FAF8EF")
      .attr("stroke-opacity", 0.4)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d: any) => d.x)
          .y((d: any) => d.y) as any
      )
      .attr("stroke-width", (d: any) => d.source.height + 1);

    const node = svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr(
        "transform",
        (d) =>
          `translate(${this.isMobile ? (d as any).x : (d as any).y},${
            this.isMobile ? (d as any).y : (d as any).x
          })${this.isMobile && d.depth != 0 ? ", rotate(-30)" : ""}`
      );

    node
      .append("circle")
      .attr("fill", "#ffffff")
      .attr("r", 2.5)
      .attr("opacity", (d) => (d.depth == 0 ? 1 : 0));

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("y", (d) => {
        if (d.depth == 0) return -14;
        return 0;
      })
      .attr("text-anchor", (d) => (this.isMobile ? "middle" : d.children ? "end" : "start"))
      .text((d: any) => {
        if (d.data.country) return d.data.country.name + ` (${d.data.count})`;
        return d.data.name;
      })
      .attr("font-size", (d) => `1.${d.height}rem`)
      .style("font-weight", (d) => this.getTextFontWeight(d.depth))
      .attr("fill", "white");
  }

  private getRegionsAsTree(): TreeNode {
    let totalArtists = 0;
    this.userRegionsCount.forEach((region) => {
      totalArtists += region.count;
    });

    const root: TreeNode = {
      name: `World (${totalArtists} artists)`,
      count: totalArtists,
      children: [],
    };

    this.userRegionsCount.forEach((region) => {
      const regionNode: TreeNode = {
        name: region.name + ` (${region.count})`,
        count: region.count,
        children: this.getSubRegionAsTree(region),
      };

      root.children.push(regionNode);
    });

    return root;
  }

  private getSubRegionAsTree(region: RegionCount): TreeNode[] {
    const subRegionNodes = region.intermediateRegions
      .map((intermediateRegion) => {
        return intermediateRegion.subRegions.map((subRegion): TreeNode => {
          return {
            name: subRegion.name + ` (${subRegion.count})`,
            count: subRegion.count,
            children: this.getCountriesNodes(subRegion),
          };
        });
      })
      .flat();

    return subRegionNodes;
  }

  private getCountriesNodes(subRegion: SubRegionCount): TreeLeaf[] {
    const countriesNodes = subRegion.countriesCount.map((countryCount): TreeLeaf => {
      return {
        country: countryCount.country,
        count: countryCount.count,
      };
    });

    return countriesNodes;
  }

  private getTextFontWeight(nodeDepth: number): string {
    if (nodeDepth == 0) return "800";
    if (nodeDepth == 1) return "700";
    if (nodeDepth == 2) return "600";
    return "500";
  }
}
