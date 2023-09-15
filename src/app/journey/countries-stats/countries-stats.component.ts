import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CountryService } from "src/app/country/country.service";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";
import { StatisticsService } from "src/app/statistics/statistics.service";
import { DiversityIndex } from "src/app/shared/supabase.model";
import { UserService } from "src/app/user/user.service";
import { Country } from "src/app/country/country.model";
import { ArtistsSources } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";
import * as d3 from "d3";
import { fromEvent, debounceTime } from "rxjs";

@Component({
  selector: "ctg-countries-stats",
  templateUrl: "./countries-stats.component.html",
  styleUrls: ["./countries-stats.component.scss"],
})
export class CountriesStatsComponent implements OnInit, AfterViewInit {
  userCountry!: Country;
  userArtistsSource!: ArtistsSources;
  userCountriesCount!: number;

  ArtistsSources = ArtistsSources;

  diversityIndexes: DiversityIndex[] | undefined;
  comparedDiversityData: ComparedDiversityData | undefined;

  diversityIndexesInUserCountry: DiversityIndex[] | undefined;
  comparedDiversityDataInUserCountry: ComparedDiversityData | undefined;

  @ViewChild("worldChart") worldChartWrapper!: ElementRef<HTMLElement>;
  @ViewChild("countryChart") countryChartWrapper!: ElementRef<HTMLElement>;

  constructor(
    private artistService: ArtistService,
    private statisticsSevice: StatisticsService,
    private countryService: CountryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    this.userCountry = this.countryService.getCountryByCode(user?.countryCode);
    this.userArtistsSource = this.artistService.getSource();
  }

  ngAfterViewInit(): void {
    this.countryService.getCountriesCount().subscribe((userCountriesCount) => {
      this.userCountriesCount = userCountriesCount.length;
      this.statisticsSevice.getDiversityIndexes().subscribe((diversityIndexes) => {
        this.diversityIndexes = diversityIndexes;
        this.generateChart(false);
        fromEvent(window, "resize")
          .pipe(debounceTime(250))
          .subscribe(() => {
            this.generateChart(false);
          });
      });

      this.statisticsSevice
        .getComparedDiversity(userCountriesCount.length)
        .subscribe((comparedDiversityData) => {
          this.comparedDiversityData = comparedDiversityData;
        });

      if (this.userCountry?.NE_ID != -1) {
        this.statisticsSevice
          .getComparedDiversityInUserCountry(userCountriesCount.length, this.userCountry.NE_ID)
          .subscribe((comparedDiversityDataInUserCountry) => {
            this.comparedDiversityDataInUserCountry = comparedDiversityDataInUserCountry;
          });

        this.statisticsSevice
          .getDiversityIndexesInUserCountry(this.userCountry.NE_ID)
          .subscribe((diversityIndexesInUserCountry) => {
            this.diversityIndexesInUserCountry = diversityIndexesInUserCountry;
            this.generateChart(true);

            fromEvent(window, "resize")
              .pipe(debounceTime(250))
              .subscribe(() => {
                this.generateChart(true);
              });
          });
      }
    });
  }

  generateChart(isInUserCountry: boolean): void {
    let diversityIndexes: DiversityIndex[] | undefined;
    if (isInUserCountry) diversityIndexes = this.diversityIndexesInUserCountry;
    else diversityIndexes = this.diversityIndexes;
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

    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    let highestUserCount = 0;
    diversityIndexes.forEach((diversityIndexes) => {
      if (diversityIndexes.occurrenceQuantity > highestUserCount)
        highestUserCount = diversityIndexes.occurrenceQuantity;
    });

    const domainArray = [];
    for (let index = 0; index <= 50; index++) domainArray.push(index.toString());

    const x = d3
      .scaleBand()
      .domain(domainArray)
      .range([marginLeft, width - marginRight])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, highestUserCount + 1])
      .range([height - marginBottom - 5, marginTop]);

    if (isInUserCountry) d3.select("#countryChartSvg").remove();
    else d3.select("#worldChartSvg").remove();

    const svg = d3
      .select(isInUserCountry ? ".country-chart-wrapper" : ".world-chart-wrapper")
      .append("svg")
      .attr("id", isInUserCountry ? "countryChartSvg" : "worldChartSvg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", marginTop)
      .attr("text-anchor", "middle")
      .text(
        isInUserCountry
          ? this.userCountry.name + " users country diveristy"
          : "World users country diversity"
      )
      .attr("fill", "#b46060")
      .style("font-weight", "800");

    // Add bars
    svg
      .append("g")
      .selectAll()
      .data(diversityIndexes)
      .join("rect")
      .attr("fill", (d: any) => {
        if (d.countriesCount == this.userCountriesCount) return "black";
        return "#b46060";
      })
      .attr("x", (d) => x(d.countriesCount.toString()) || null)
      .attr("y", (d) => y(d.occurrenceQuantity))
      .attr("height", (d) => y(0) - y(d.occurrenceQuantity))
      .attr("width", x.bandwidth());

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .attr("fill", "#b46060")
      .call(d3.axisBottom(x).ticks(0))
      .call((g) => g.selectAll(".tick text").attr("fill", "#b46060"));

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(3))
      .attr("fill", "#b46060")
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".tick text").attr("fill", "#b46060").style("font-weight", "800"))
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 5)
          .attr("fill", "#b46060")
          .attr("text-anchor", "start")
          .text("Users")
      );
  }
}
