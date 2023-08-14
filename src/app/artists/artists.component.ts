import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { filter } from "rxjs";
import { Artist } from "./artist.model";

import * as d3 from "d3";
import { ArtistService } from "./artist.service";
import {
  CountryData,
  RegionData,
  MapSVG,
  ColorScale,
  Tooltip,
  GeoFeature,
  LabelData,
} from "../country/country.model";
import { CountryService } from "../country/country.service";
import { Message } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { LoginComponent } from "../authorization/login/login.component";
import { SuggestionsComponent } from "../suggestions/suggestions.component";

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
  messages: Message[] = [
    {
      detail:
        "Hey, Taylor Swift is not from China! What a stupid tool! \n\n\r\n Sometimes, the little robot that guesses the artists countries might say something stupid. He's trying his best. You can help him by suggesting the correct artist country of origin!",
      id: 0,
      severity: "warn",
    },
  ];
  isMessageActive = true;

  private mapSvg!: MapSVG;
  private colorScale!: ColorScale;
  private tooltip!: Tooltip;
  private colorPalette = [
    "#f1eef6",
    "#d0d1e6",
    "#a6bddb",
    "#74a9cf",
    "#3690c0",
    "#0570b0",
    "#034e7b",
  ];
  ref: DynamicDialogRef | undefined;

  DataTypes = DataTypes;

  @ViewChild("mapWrapper") mapWrapper!: ElementRef<HTMLElement>;
  @HostListener("window:resize") onResize() {
    const height = this.mapWrapper.nativeElement.offsetHeight;
    const width = this.mapWrapper.nativeElement.offsetWidth;
    this.mapSvg.select("#map").attr("width", width).attr("height", height);
  }

  constructor(
    private artistsService: ArtistService,
    private countryService: CountryService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesData = this.countryService.countCountries(userTopArtists);
        this.regionsData = this.countryService.countRegions(userTopArtists);

        this.colorScale = d3
          .scaleThreshold<number, string>()
          .domain(this.getColorScaleDomain())
          .range(this.colorPalette);
      });
  }

  //The map can only be initialized after view has initiated
  ngAfterViewInit(): void {
    this.addMap();
    this.addMapLegend();

    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe(() => {
        this.setCountriesColorInMap();
        this.setLegendText();
      });
  }

  setSelectedData(dataType: DataTypes): void {
    this.selectedData = dataType;
  }

  hideMessage(): void {
    this.isMessageActive = false;
  }

  openDialog() {
    this.ref = this.dialogService.open(SuggestionsComponent, {
      header: "Make your suggestions!",
      data: this.artists,
    });

    this.ref.onClose.subscribe((hasSuggestions) => {
      if (hasSuggestions) {
        this.countriesData = this.countryService.countCountries(this.artists);
        this.regionsData = this.countryService.countRegions(this.artists);
        this.setCountriesColorInMap();
        this.setLegendText();
      }
    });
  }

  private addMap() {
    const height = this.mapWrapper.nativeElement.offsetHeight;
    const width = this.mapWrapper.nativeElement.offsetWidth;
    const margin = 32;

    const geoJSON = this.countryService.geoJSON;
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

    this.tooltip = d3
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
        this.countryService.findCountryFlagCode(feature)
      )
      .attr("fill", this.colorPalette[0]);
  }

  private getColorScaleDomain(): number[] {
    const counts = this.countriesData.map((countryData) => countryData.count).reverse();
    const domainSet = new Set<number>(counts);

    return [...domainSet];
  }

  private addMapLegend(): void {
    const labelsWrapper = this.mapSvg
      .append("g")
      .attr("id", "labelsWrapper")
      .attr("transform", "translate(16, 0)");

    labelsWrapper
      .append("text")
      .text("Artists per country")
      .attr("transform", "translate(0, -8)")
      .attr("fill", "grey")
      .attr("font-size", "small");

    labelsWrapper
      .selectAll("g")
      .data(this.colorPalette)
      .enter()
      .append("g")
      .attr("id", "labelsGroup");

    labelsWrapper
      .selectAll("g")
      .data(this.colorPalette)
      .append("rect")
      .attr("id", (d: string, i: number) => "rect" + i)
      .attr("fill", (d: string) => d)
      .attr("width", "1.25rem")
      .attr("height", "1.25rem")
      .attr("font-size", "small")
      .attr("transform", (d: string, i: number) => `translate(0,${i * 28})`);

    labelsWrapper
      .selectAll("g")
      .data(this.colorPalette)
      .append("text")
      .attr("transform", (d: string, i: number) => `translate(${26},${10 + i * 28})`)
      .attr("alignment-baseline", "central")
      .attr("fill", "grey")
      .attr("font-size", "small");

    const labelsWrapperHeight = (labelsWrapper.node() as SVGAElement).getBoundingClientRect()
      .height;

    const mapCoordinates = (document.querySelector("#map") as Element).getBoundingClientRect();

    labelsWrapper.attr(
      "transform",
      `translate(16, ${mapCoordinates.y + mapCoordinates.height - labelsWrapperHeight})`
    );
  }

  private setCountriesColorInMap(): void {
    const geoJSON = this.countryService.geoJSON;

    this.mapSvg
      .selectAll("svg #map path")
      .data(geoJSON.features)
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
        this.tooltip.style("visibility", "visible");
        this.tooltip.style("opacity", "0.9");
        this.tooltip.style("color", "black");

        this.tooltip.html(countryTag);
      })
      .on("mousemove", (event) => {
        this.tooltip.style("top", event.pageY + "px").style("left", event.pageX + 16 + "px");
      })
      .on("mouseout", () => {
        this.tooltip.style("visibility", "hidden");
      });
  }

  private getColorLabelText(labelData: LabelData, isLast: boolean): string {
    if (labelData.min && labelData.max) {
      if (labelData.max - labelData.min === 1)
        return labelData.min.toString() + (isLast ? "+" : "");
      else return labelData.min + " to " + (labelData.max - 1) + (isLast ? "+" : "");
    }
    if (labelData.max === 1) return "0";

    if (!labelData.min && labelData.max) return "Less than " + labelData.max;
    if (!labelData.max && labelData.min) return "More than " + labelData.min;

    return "Not used";
  }

  private setLegendText(): void {
    const colorLabels: LabelData[] = this.colorPalette.map((color) => {
      return {
        min: this.colorScale.invertExtent(color)[0],
        max: this.colorScale.invertExtent(color)[1],
        fill: color,
      };
    });

    this.mapSvg
      .selectAll("#labelsGroup text")
      .data(colorLabels)
      .text((d: LabelData, i: number) => {
        const isTheLast = i === colorLabels.length - 1;
        return this.getColorLabelText(d, isTheLast);
      });
  }
}
