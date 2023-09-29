import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as d3 from "d3";
import { Observable, take, switchMap, fromEvent, debounceTime } from "rxjs";
import { ArtistsSources } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";
import { Country } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import { RegionService } from "src/app/region/region.service";
import { SubRegionsDiversityIndex } from "src/app/shared/supabase.model";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";
import { StatisticsService } from "src/app/statistics/statistics.service";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "ctg-sub-regions-stats",
  templateUrl: "./sub-regions-stats.component.html",
  styleUrls: ["./sub-regions-stats.component.scss"],
})
export class SubRegionsStatsComponent implements OnInit, AfterViewInit {
  comparedSubRegionDiversity!: Observable<ComparedDiversityData>;
  comparedSubRegionDiversityInUserCountry!: Observable<ComparedDiversityData>;

  subRegionsDiversityIndexes!: SubRegionsDiversityIndex[] | undefined;
  subRegionsDiversityIndexesInUserCountry!: SubRegionsDiversityIndex[] | undefined;

  userCountry!: Country;
  userArtistsSource!: ArtistsSources;
  artistsSource = ArtistsSources;

  userSubRegionsCount!: number;

  @ViewChild("subRegionsWorldChart") worldChartWrapper!: ElementRef<HTMLElement>;
  @ViewChild("subRegionsCountryChart") countryChartWrapper!: ElementRef<HTMLElement>;

  constructor(
    private statisticsService: StatisticsService,
    private regionService: RegionService,
    private userService: UserService,
    private countryService: CountryService,
    private artistService: ArtistService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    this.userCountry = this.countryService.getCountryByCode(user?.countryCode);
    this.userArtistsSource = this.artistService.getSource();

    this.regionService.getRegionsDiversity().subscribe((diversityData) => {
      this.userSubRegionsCount = diversityData.subRegions;
    });

    this.comparedSubRegionDiversity = this.regionService.getRegionsDiversity().pipe(
      take(1),
      switchMap((diversityData) => {
        return this.statisticsService.getComparedSubRegionsDiversity(diversityData.subRegions);
      })
    );

    if (this.userCountry.NE_ID != -1) {
      this.comparedSubRegionDiversityInUserCountry = this.regionService.getRegionsDiversity().pipe(
        take(1),
        switchMap((diversityData) => {
          return this.statisticsService.getComparedSubRegionsDiversity(
            diversityData.subRegions,
            this.userCountry.NE_ID
          );
        })
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.userArtistsSource == ArtistsSources.SPOTIFY) return;

    this.statisticsService.getSubRegionsDiversity().subscribe((subRegionsDiversity) => {
      this.subRegionsDiversityIndexes = subRegionsDiversity;
      this.generateSubRegionsChart(false);

      fromEvent(window, "resize")
        .pipe(debounceTime(250))
        .subscribe(() => {
          this.generateSubRegionsChart(false);
        });
    });

    if (this.userCountry.NE_ID != -1) {
      this.statisticsService
        .getSubRegionsDiversityInUserCountry(this.userCountry.NE_ID)
        .subscribe((subRegionsDiversityInUserCountry) => {
          this.subRegionsDiversityIndexesInUserCountry = subRegionsDiversityInUserCountry;
          this.generateSubRegionsChart(true);

          fromEvent(window, "resize")
            .pipe(debounceTime(250))
            .subscribe(() => {
              this.generateSubRegionsChart(true);
            });
        });
    }
  }

  generateSubRegionsChart(isInUserCountry: boolean): void {
    let diversityIndexes: SubRegionsDiversityIndex[] | undefined;
    if (isInUserCountry) diversityIndexes = this.subRegionsDiversityIndexesInUserCountry;
    else diversityIndexes = this.subRegionsDiversityIndexes;
    if (diversityIndexes == undefined) return;

    let height: number;
    let width: number;
    if (isInUserCountry) {
      height = this.countryChartWrapper.nativeElement.offsetHeight;
      width = this.countryChartWrapper.nativeElement.offsetWidth;
    } else {
      height = this.worldChartWrapper.nativeElement.offsetHeight;
      width = this.worldChartWrapper.nativeElement.offsetWidth;
    }

    const marginTop = this.isMobile() ? 40 : 72;
    const marginBottom = this.isMobile() ? 32 : 56;
    const marginLeft = this.isMobile() ? 48 : 64;
    const marginRight = this.isMobile() ? 16 : 32;

    const chartMarginTop = marginTop;
    const chartMarginBottom = marginBottom;
    const chartMarginLeft = marginLeft;
    const chartMarginRight = marginRight;

    const labelMarginTop = 16;
    const labelMarginLeft = 16;
    const labelMarginBottom = this.isMobile() ? 30 : 40;

    const distinctDiversityIndexes = new Map<number, SubRegionsDiversityIndex>();
    diversityIndexes.forEach((index) => {
      const currentDiversityIndex = distinctDiversityIndexes.get(index.subRegionsCount);
      if (currentDiversityIndex == undefined) {
        distinctDiversityIndexes.set(index.subRegionsCount, { ...index });
      } else {
        currentDiversityIndex.occurrenceQuantity += index.occurrenceQuantity;
        distinctDiversityIndexes.set(index.subRegionsCount, currentDiversityIndex);
      }
    });

    let highestUserCount = 0;
    distinctDiversityIndexes.forEach((value) => {
      if (value.occurrenceQuantity > highestUserCount) highestUserCount = value.occurrenceQuantity;
    });

    const domainArray = [];
    for (let index = 1; index <= 24; index++) domainArray.push(index.toString());

    const x = d3
      .scaleBand()
      .domain(domainArray)
      .range([chartMarginLeft, width - chartMarginRight])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, highestUserCount + Math.ceil(highestUserCount * 0.1)])
      .range([height - chartMarginBottom - 5, chartMarginTop]);

    if (isInUserCountry) d3.select("#subRegionsCountryChartSvg").remove();
    else d3.select("#subRegionsWorldChartSvg").remove();

    const svg = d3
      .select(
        isInUserCountry ? ".subregions-country-chart-wrapper" : ".subregions-world-chart-wrapper"
      )
      .append("svg")
      .attr("id", isInUserCountry ? "subRegionsCountryChartSvg" : "subRegionsWorldChartSvg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", labelMarginTop)
      .attr("text-anchor", "middle")
      .text(
        isInUserCountry
          ? `Regions diversity among users' top artists (${this.userCountry.name})`
          : "Regions diversity among users' top artists (World)"
      )
      .attr("fill", "#836547")
      .attr("font-size", this.isMobile() ? "var(--fs--200)" : "var(--fs-100)")
      .style("font-weight", "800");

    svg
      .append("text")
      .attr("x", -(height / 2))
      .attr("y", labelMarginLeft)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("fill", "#836547")
      .attr("font-size", this.isMobile() ? "var(--fs--300)" : "var(--fs-000)")
      .style("font-weight", "800")
      .text("Users quantity");

    // Add bars
    const bar = svg.selectAll("g").data(distinctDiversityIndexes.values()).join("g");
    bar
      .append("rect")
      .attr("fill", (d: any) => {
        if (d.subRegionsCount == this.userSubRegionsCount) return "#539987";
        return "#e58876";
      })
      .attr("x", (d) => x(d.subRegionsCount.toString()) || null)
      .attr("y", (d) => y(d.occurrenceQuantity))
      .attr("height", (d) => y(0) - y(d.occurrenceQuantity))
      .attr("width", x.bandwidth());

    if (!this.isMobile()) {
      bar
        .append("text")
        .text((d) => d.occurrenceQuantity)
        .attr("x", (d) => (x(d.subRegionsCount.toString()) || 0) + x.bandwidth() / 2 || null)
        .attr("y", (d) => y(d.occurrenceQuantity) + 12)
        .attr("fill", "#f6e1c3")
        .attr("font-size", this.isMobile() ? "var(--fs--300)" : "var(--fs--300)")
        .attr("text-anchor", "middle")
        .style("font-weight", "800");
    }

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - chartMarginBottom})`)
      .attr("fill", "#836547")
      .call(
        d3
          .axisBottom(x)
          .tickValues([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
          ])
          .tickSizeOuter(0)
      )
      .call((g) =>
        g
          .select(".domain")
          .attr("stroke", "#836547")
          .attr("stroke-width", "4px")
          .attr("stroke-linecap", "round")
      )
      .call((g) => g.selectAll(".tick text").attr("fill", "#836547").style("font-weight", "800"))
      .call((g) => {
        g.append("text")
          .attr("x", width / 2)
          .attr("y", labelMarginBottom)
          .attr("text-anchor", "middle")
          .attr("fill", "#836547")
          .attr("font-size", this.isMobile() ? "var(--fs--300)" : "var(--fs-000)")
          .style("font-weight", "800")
          .text("Regions diversity");
      });

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${chartMarginLeft},0)`)
      .call(d3.axisLeft(y))
      .attr("fill", "#836547")
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick text").attr("fill", "#836547").style("font-weight", "800"));

    const label = svg.append("g");
    const firstLabel = label.append("g");
    firstLabel
      .append("rect")
      .attr("width", this.isMobile() ? "0.5rem" : "1rem")
      .attr("height", this.isMobile() ? "0.5rem" : "1rem")
      .attr("ry", "100%")
      .style("fill", "#539987");
    firstLabel
      .append("text")
      .text("You")
      .attr("dx", this.isMobile() ? "0.75rem" : "1.25rem")
      .attr("dy", this.isMobile() ? "0.25rem" : "0.5rem")
      .style("font-size", this.isMobile() ? "var(--fs--200)" : "var(--fs--100)")
      .attr("alignment-baseline", "central");

    const firstLabelWidth = firstLabel.node()?.getBoundingClientRect().width || 16;
    const secondLabel = label.append("g").attr("transform", `translate(${firstLabelWidth + 16},0)`);
    secondLabel
      .append("rect")
      .attr("trasnform", `translate(${firstLabelWidth},0)`)
      .attr("width", this.isMobile() ? "0.5rem" : "1rem")
      .attr("height", this.isMobile() ? "0.5rem" : "1rem")
      .attr("ry", "100%")
      .style("fill", "#e58876");
    secondLabel
      .append("text")
      .text("Others")
      .attr("dx", this.isMobile() ? "0.75rem" : "1.25rem")
      .attr("dy", this.isMobile() ? "0.25rem" : "0.5rem")
      .style("font-size", this.isMobile() ? "var(--fs--200)" : "var(--fs--100)")
      .attr("alignment-baseline", "central");

    const labelWidth = label.node()?.getBoundingClientRect().width || 16;
    label.attr("transform", `translate(${width / 2 - labelWidth / 2}, ${labelMarginTop * 1.75})`);
  }

  isMobile(): boolean {
    return window.innerWidth < 641;
  }
}
