import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RegionCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import * as d3 from "d3";
import { TreeNode } from "./third-act.types";

@Component({
  selector: "ctg-third-act",
  templateUrl: "./third-act.component.html",
  styleUrls: ["./third-act.component.scss"],
})
export class ThirdActComponent implements OnInit, AfterViewInit {
  userRegionsCount: RegionCount[] = [];

  @ViewChild("treeWrapper") treeWrapper!: ElementRef<HTMLElement>;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getRegionsCount().subscribe((userRegionsCount) => {
      this.userRegionsCount = userRegionsCount;
    });
  }

  ngAfterViewInit(): void {
    const treeData = this.getRegionsAsTree();

    const width = this.treeWrapper.nativeElement.offsetWidth;

    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const root = d3.hierarchy(treeData);
    const dx = 35;
    const dy = width / (root.height + 1);

    // Create a tree layout.
    const tree = d3.cluster().nodeSize([dx, dy]);

    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.ascending(b.data.count, a.data.count));
    tree(root as any);

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity;
    let x1 = -x0;
    root.each((d) => {
      if ((d as any).x > x1) x1 = (d as any).x;
      if ((d as any).x < x0) x0 = (d as any).x;
    });

    // Compute the adjusted height of the tree.
    const height = x1 - x0 + dx * 2;

    const svg = d3
      .select(".tree-wrapper")
      .append("svg")
      .attr("width", width - 64)
      .attr("height", height - 64)
      .attr("viewBox", [-dy / 3, x0 - dx, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => (d as any).y)
          .y((d) => (d as any).x) as any
      );

    const node = svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${(d as any).y},${(d as any).x})`);

    node
      .append("circle")
      .attr("fill", (d) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -6 : 6))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name)
      .clone(true)
      .attr("font-size", (d) => (d.children ? "1rem" : "1rem"))
      .attr("fill", "white");
  }

  private getRegionsAsTree(): TreeNode {
    const tree: TreeNode = {
      name: "World",
      count: Infinity,
      children: [],
    };

    this.userRegionsCount.forEach((region) => {
      const intermediateNodes = region.intermediateRegions.map((region) => {
        const subNodes = region.subRegions.map((region) => {
          const countriesNodes = region.countriesCount.map((countryCount) => {
            return {
              name: countryCount.name + ` (${countryCount.count})`,
              count: countryCount.count,
              children: [],
            };
          });

          return {
            name: region.name + ` (${region.count})`,
            count: region.count,
            children: countriesNodes,
          };
        });

        return {
          name: region.name + ` (${region.count})`,
          count: region.count,
          children: subNodes,
        };
      });

      const node = {
        name: region.name + ` (${region.count})`,
        count: region.count,
        children: intermediateNodes,
      };

      tree.children.push(node);
    });

    return tree;
  }
}
