import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CountryService } from "src/app/country/country.service";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";
import { StatisticsService } from "src/app/statistics/statistics.service";
import * as d3 from "d3";
import { DiversityIndex } from "src/app/shared/supabase.model";
import { UserService } from "src/app/user/user.service";
import { User } from "src/app/user/user.model";

@Component({
  selector: "ctg-second-act",
  templateUrl: "./second-act.component.html",
  styleUrls: ["./second-act.component.scss"],
})
export class SecondActComponent implements OnInit, AfterViewInit {
  user!: User;

  diversityIndexes: DiversityIndex[] | undefined;
  comparedDiversityData: ComparedDiversityData | undefined;

  diversityIndexesInUserCountry: DiversityIndex[] | undefined;
  comparedDiversityDataInUserCountry: ComparedDiversityData | undefined;

  @ViewChild("worldChartWrapper") worldChartWrapper!: ElementRef<HTMLElement>;
  @ViewChild("countryChartWrapper", { static: false })
  countryChartWrapper!: ElementRef<HTMLElement>;

  constructor(
    private statisticsSevice: StatisticsService,
    private countryService: CountryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();

    this.countryService.getCountriesCount().subscribe((userCountriesCount) => {
      this.statisticsSevice
        .getComparedDiversity(userCountriesCount.length)
        .subscribe((comparedDiversityData) => {
          this.comparedDiversityData = comparedDiversityData;
        });

      if (this.user.countryCode) {
        this.statisticsSevice
          .getComparedDiversityInUserCountry(userCountriesCount.length, this.user.countryCode)
          .subscribe((comparedDiversityDataInUserCountry) => {
            this.comparedDiversityDataInUserCountry = comparedDiversityDataInUserCountry;
          });
      }
    });
  }

  ngAfterViewInit(): void {
    this.statisticsSevice.getDiversityIndexes().subscribe((diversityIndexes) => {
      this.diversityIndexes = diversityIndexes;
      this.generateChart(false);
    });

    if (this.user.countryCode) {
      this.statisticsSevice
        .getDiversityIndexesInUserCountry(this.user.countryCode)
        .subscribe((diversityIndexesInUserCountry) => {
          this.diversityIndexesInUserCountry = diversityIndexesInUserCountry;
          this.generateChart(true);
        });
    }
  }

  generateChart(isInUserCountry: boolean): void {
    let diversityIndexes: DiversityIndex[] | undefined;
    if (isInUserCountry) diversityIndexes = this.diversityIndexesInUserCountry;
    else diversityIndexes = this.diversityIndexes;
    if (diversityIndexes == undefined) return;

    let height;
    let width;
    if (isInUserCountry) {
      height = this.countryChartWrapper.nativeElement.offsetHeight;
      width = this.countryChartWrapper.nativeElement.offsetWidth;
    } else {
      height = this.worldChartWrapper.nativeElement.offsetHeight;
      width = this.worldChartWrapper.nativeElement.offsetWidth;
    }

    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    let totalUsers = 0;
    diversityIndexes.forEach(
      (diversityIndexes) => (totalUsers += diversityIndexes.occurrenceQuantity)
    );

    // Declare the x (horizontal position) scale.
    const x = d3
      .scaleBand()
      .domain([
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
      ]) // descending frequency
      .range([marginLeft, width - marginRight])
      .padding(0.5);

    // Declare the y (vertical position) scale.
    const y = d3
      .scaleLinear()
      .domain([0, totalUsers])
      .range([height - marginBottom - 10, marginTop]);

    // Create the SVG container.
    const svg = d3
      .select(isInUserCountry ? ".country-chart-wrapper" : ".world-chart-wrapper")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Add a rect for each bar.
    svg
      .append("g")
      .attr("fill", "white")
      .selectAll()
      .data(diversityIndexes)
      .join("rect")
      .attr("x", (d) => x(d.countriesCount.toString()) || null)
      .attr("y", (d) => y(d.occurrenceQuantity))
      .attr("height", (d) => y(0) - y(d.occurrenceQuantity))
      .attr("width", x.bandwidth())
      .attr("rx", "0.5rem");

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("Users")
      );
  }
}
