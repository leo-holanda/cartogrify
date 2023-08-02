import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CountriesService } from "../countries/countries.service";
import { filter } from "rxjs";
import { Artist } from "./artist.model";
import {
  ColorScale,
  CountryData,
  GeoFeature,
  LabelData,
  MapSVG,
  RegionData,
} from "../countries/country.model";
import * as d3 from "d3";
import { ArtistService } from "./artist.service";

enum DataTypes {
  COUNTRIES = "countries",
  REGIONS = "regions",
  ARTISTS = "artists",
}

@Component({
  selector: "msm-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.scss"],
})
export class ArtistsComponent implements OnInit, AfterViewInit {
  artists: Artist[] = [];
  countriesData: CountryData[] = [];
  regionsData: RegionData[] = [];
  selectedData = DataTypes.COUNTRIES;

  private mapSvg!: MapSVG;

  private colorScale!: ColorScale;
  private colorPalette = [
    "#f1eef6",
    "#d0d1e6",
    "#a6bddb",
    "#74a9cf",
    "#3690c0",
    "#0570b0",
    "#034e7b",
  ];

  DataTypes = DataTypes;

  @ViewChild("mapWrapper") mapWrapper!: ElementRef;

  constructor(private artistsService: ArtistService, private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesData = this.countriesService.countCountries(userTopArtists);
        this.regionsData = this.countriesService.countRegions(userTopArtists);

        this.colorScale = d3
          .scaleThreshold<number, string>()
          .domain(this.getColorScaleDomain())
          .range(this.colorPalette);
      });
  }

  //The map can only be initialized after view has initiated
  ngAfterViewInit(): void {
    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe(() => this.setMap());
  }

  setSelectedData(dataType: DataTypes): void {
    this.selectedData = dataType;
  }

  private setMap() {
    const height = this.mapWrapper.nativeElement.offsetHeight as number;
    const width = this.mapWrapper.nativeElement.offsetWidth as number;
    const margin = 32;

    const geoJSON = this.countriesService.geoJSON;
    const projection = d3.geoNaturalEarth1().fitSize([width - margin, height - margin], geoJSON);
    const path = d3.geoPath().projection(projection);

    const zoom = d3
      .zoom()
      .translateExtent([
        [-margin, -margin],
        [width + margin, height + margin],
      ])
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        d3.select("svg #map").attr("transform", event.transform);
      });

    this.mapSvg = d3
      .select(".map-wrapper")
      .append("svg")
      .attr("class", "svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("aspect-ratio", "auto")
      .call(zoom as any);

    const tooltip = d3
      .select(".map-wrapper")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    this.mapSvg
      .append("g")
      .attr("id", "map")
      .selectAll("path")
      .data(geoJSON.features)
      .join("path")
      .attr("d", path)
      .attr("country-name", (feature: GeoFeature) => {
        if (feature.properties) return feature.properties["NAME"];
        else return "";
      })
      .attr("country-flag-code", (feature: GeoFeature) =>
        this.countriesService.findCountryFlagCode(feature)
      )
      .attr("fill", (feature: GeoFeature) => {
        const currentCountry = this.countriesData.find(
          (countryData) => countryData.country.name === feature.properties["NAME"]
        );

        return this.colorScale(currentCountry ? currentCountry.count : 0);
      })
      .on("mouseenter", (event) => {
        const countryName = event.srcElement.getAttribute("country-name");
        const countryFlagCode = event.srcElement.getAttribute("country-flag-code");

        const artistsFromCountry = this.artists
          .filter((artist) => artist.country?.flagCode === countryFlagCode)
          .map((artist) => artist.name);

        let countryTag = `
            <div> 
              <span class="fi fi-${countryFlagCode} flag"></span>
              <strong>
                ${countryName}
              </strong> 
              <hr style="margin: 0.25rem 0 0.25rem 0" />

            </div>
          `;

        artistsFromCountry.forEach((artistName) => {
          const artistTag = document.createElement("div");
          artistTag.innerHTML = artistName;
          countryTag += artistTag.outerHTML;
        });

        if (artistsFromCountry.length === 0) countryTag += "No artists here.";

        tooltip.style("visibility", "visible");
        tooltip.style("opacity", "0.9");
        tooltip.html(countryTag);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", event.pageY + "px").style("left", event.pageX + 16 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    this.addMapLegend();
  }

  private getColorScaleDomain(): number[] {
    const counts = this.countriesData.map((countryData) => countryData.count).reverse();
    const domainSet = new Set<number>(counts);

    return [...domainSet];
  }

  private getColorLabelText(labelData: LabelData): string {
    if (labelData.min && labelData.max) {
      if (labelData.max - labelData.min === 1) return labelData.min.toString();
      else return labelData.min + " to " + (labelData.max - 1);
    }
    if (labelData.max === 1) return "0";

    if (!labelData.min && labelData.max) return "Less than " + labelData.max;
    if (!labelData.max && labelData.min) return "More than " + labelData.min;

    return "Not used";
  }

  private addMapLegend(): void {
    const colorLabels: LabelData[] = this.colorPalette.map((color) => {
      return {
        min: this.colorScale.invertExtent(color)[0],
        max: this.colorScale.invertExtent(color)[1],
        fill: color,
      };
    });

    const labelsWrapper = this.mapSvg
      .append("g")
      .attr("id", "labelsWrapper")
      .attr("transform", "translate(16, 0)");

    labelsWrapper.selectAll("g").data(this.colorPalette).enter().append("g");

    labelsWrapper
      .append("text")
      .text("Artists per country")
      .attr("transform", "translate(0, -8)")
      .attr("fill", "grey")
      .attr("font-size", "small");

    labelsWrapper
      .selectAll("g")
      .data(colorLabels)
      .append("rect")
      .attr("id", (d: LabelData, i: number) => "rect" + i)
      .attr("fill", (d: LabelData) => d.fill)
      .attr("width", "1.25rem")
      .attr("height", "1.25rem")
      .attr("font-size", "small")
      .attr("transform", (d: LabelData, i: number) => `translate(0,${i * 28})`);

    labelsWrapper
      .selectAll("g")
      .data(colorLabels)
      .append("text")
      .attr("transform", (d: LabelData, i: number) => {
        const rectCoordinates = (
          document.querySelector("#rect" + i) as Element
        ).getBoundingClientRect();
        return `translate(${26},${8 + rectCoordinates.y})`;
      })
      .attr("alignment-baseline", "central")
      .attr("fill", "grey")
      .attr("font-size", "small")
      .text((d: LabelData) => this.getColorLabelText(d) || null);

    const labelsWrapperHeight = (
      document.querySelector("#labelsWrapper") as Element
    ).getBoundingClientRect().height;

    const mapCoordinates = (document.querySelector("#map") as Element).getBoundingClientRect();

    labelsWrapper.attr(
      "transform",
      `translate(16, ${mapCoordinates.y + mapCoordinates.height - labelsWrapperHeight})`
    );
  }
}
