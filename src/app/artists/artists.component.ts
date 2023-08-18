import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { debounceTime, filter, fromEvent, take } from "rxjs";
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
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { MenuItem } from "primeng/api";
import { ListboxClickEvent } from "primeng/listbox";
import { colorPalettes } from "./artist.colors";

enum DataTypes {
  COUNTRIES = "Countries",
  REGIONS = "Regions",
  ARTISTS = "Artists",
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
  isMessageActive = true;

  activeItem = DataTypes.COUNTRIES;
  items: MenuItem[] = [
    {
      label: DataTypes.COUNTRIES,
      icon: "pi pi-flag-fill",
    },
    {
      label: DataTypes.REGIONS,
      icon: "pi pi-map",
    },
    {
      label: DataTypes.ARTISTS,
      icon: "pi pi-user",
    },
  ];

  private mapSvg!: MapSVG;
  private tooltip!: Tooltip;

  colorPalettes = colorPalettes;
  private colorPalette = colorPalettes[0].colors;
  private colorScale!: ColorScale;
  mapBackgroundColor = "rgb(255, 255, 255)";

  ref: DynamicDialogRef | undefined;
  @ViewChild("mapWrapper") mapWrapper!: ElementRef<HTMLElement>;

  DataTypes = DataTypes;

  constructor(
    private artistsService: ArtistService,
    private countryService: CountryService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.artistsService
      .getUserTopArtists()
      .pipe(
        filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined),
        take(1)
      )
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesData = this.countryService.countCountries(userTopArtists);
        this.regionsData = this.countryService.countRegions(userTopArtists);
      });
  }

  //The map can only be initialized after view has initiated
  ngAfterViewInit(): void {
    this.addMap();

    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesData = this.countryService.countCountries(userTopArtists);
        this.regionsData = this.countryService.countRegions(userTopArtists);

        const { domain, range } = this.getScaleData();
        this.colorScale = d3.scaleThreshold<number, string>().domain(domain).range(range);

        this.setCountriesColorInMap();
        this.addMapLegend();

        fromEvent(window, "resize")
          .pipe(debounceTime(250))
          .subscribe(() => {
            d3.select("svg").remove();
            this.addMap();
            this.addMapLegend();
            this.setCountriesColorInMap();
          });
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
      }
    });
  }

  onActiveItemChange(activeItem: MenuItem): void {
    this.activeItem = activeItem.label as DataTypes;
  }

  onColorPaletteSelect(event: ListboxClickEvent): void {
    this.colorPalette = event.option.colors;
    this.mapBackgroundColor = event.option.background;
    this.setCountriesColorInMap();
    this.addMapLegend();
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
      })
      .on("start", () => {
        this.mapSvg.attr("cursor", "grabbing");
      })
      .on("end", () => {
        this.mapSvg.attr("cursor", "grab");
      });

    this.mapSvg = d3
      .select(".map-wrapper")
      .append("svg")
      .attr("class", "svg")
      .attr("cursor", "grab")
      .attr("viewBox", [0, 0, width, height])
      .call(zoom as any);

    d3.select("#tooltip").remove();
    this.tooltip = d3
      .select(".map-wrapper")
      .append("div")
      .attr("id", "tooltip")
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

  private getScaleData(): { domain: number[]; range: string[] } {
    const counts = this.countriesData.map((countryData) => countryData.count).sort();
    const domain = [...new Set<number>(counts)];
    const colorPalette = [...this.colorPalette];

    //If the number of values in the scale’s range is N+1, the number of values in the scale’s domain must be N
    //https://github.com/d3/d3-scale#threshold_domain
    while (domain.length < colorPalette.length - 1) {
      const colorToBeRemovedIndex = Math.floor(colorPalette.length / 2);
      colorPalette.splice(colorToBeRemovedIndex, 1);
    }

    return {
      domain,
      range: colorPalette,
    };
  }

  private addMapLegend(): void {
    setTimeout(() => {
      this.mapSvg.selectAll("text").remove();
      this.mapSvg.selectAll("rect").remove();

      const mapMeasures = (document.querySelector("#map") as Element).getBoundingClientRect();
      const mapViewWidthFactor = mapMeasures.width * 0.001;
      const legendY = mapMeasures.y + mapMeasures.height - 96 * mapViewWidthFactor;
      const legendX = 64 * mapViewWidthFactor;
      const fontSize = 12 * mapViewWidthFactor;
      const labelDistance = 20;
      const rectDistanceToCenter = 8;

      const { range } = this.getScaleData();
      const colorLabels: LabelData[] = range.map((color) => {
        return {
          min: this.colorScale.invertExtent(color)[0],
          max: this.colorScale.invertExtent(color)[1],
          fill: color,
        };
      });

      this.mapSvg
        .append("text")
        .text("Artists per country")
        .attr("fill", "grey")
        .attr("font-size", fontSize)
        .attr("transform", `translate(${legendX}, ${legendY - 8 * mapViewWidthFactor})`);

      this.mapSvg
        .selectAll(".rect")
        .data(range)
        .enter()
        .append("rect")
        .attr("fill", (d: string) => d)
        .attr("width", fontSize)
        .attr("height", fontSize)
        .attr(
          "transform",
          (d: string, i: number) =>
            `translate(${legendX},${legendY + i * labelDistance * mapViewWidthFactor})`
        );

      this.mapSvg
        .selectAll(".color-label")
        .data(colorLabels)
        .enter()
        .append("text")
        .attr("class", "color-label")
        .attr("alignment-baseline", "central")
        .attr("fill", "grey")
        .attr("font-size", fontSize)
        .attr(
          "transform",
          (d: LabelData, i: number) =>
            `translate(${legendX + labelDistance * mapViewWidthFactor},${
              legendY + rectDistanceToCenter + i * labelDistance * mapViewWidthFactor
            })`
        )
        .text((d: LabelData, i: number) => {
          const isTheLast = i === colorLabels.length - 1;
          return this.getColorLabelText(d, isTheLast);
        });
    }, 100);
  }

  private setCountriesColorInMap(): void {
    const geoJSON = this.countryService.geoJSON;

    const { domain, range } = this.getScaleData();
    this.colorScale = d3.scaleThreshold<number, string>().domain(domain).range(range);

    this.mapSvg
      .selectAll("svg #map path")
      .data(geoJSON.features)
      .attr("cursor", "pointer")
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
}
