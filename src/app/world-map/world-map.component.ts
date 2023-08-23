import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import { ListboxClickEvent } from "primeng/listbox";
import {
  MapSVG,
  ColorScale,
  GeoFeature,
  LabelData,
  CountryData,
  Tooltip,
} from "../country/country.model";
import { CountryService } from "../country/country.service";
import { fromEvent, debounceTime } from "rxjs";
import * as htmlToImage from "html-to-image";
import { Artist } from "../artists/artist.model";
import { colorPalettes } from "./world-map.colors";
import { Message } from "primeng/api";

@Component({
  selector: "ctg-world-map",
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.scss"],
})
export class WorldMapComponent implements OnChanges, AfterViewInit {
  @Input() countriesData: CountryData[] = [];
  @Input() artists: Artist[] = [];
  @Input() isMobile!: boolean;
  @Output() shouldOpenRankings = new EventEmitter<boolean>();

  messages: Message[] = [
    {
      severity: "info",
      detail:
        "The map might seem small when displayed on a mobile screen due to the projection. For a larger view, consider rotating your phone!",
      life: 10000,
    } as Message,
  ];

  shareMode = false;
  usesDefaultResolution = true;
  availableResolutions = [
    {
      width: "1920px",
      height: "1080px",
    },
    {
      width: "2560px",
      height: "1440px",
    },
    {
      width: "3840px",
      height: "2160px",
    },
    {
      width: "1080px",
      height: "1080px",
    },
  ];
  shareMapResolution = this.availableResolutions[0];

  private mapSvg!: MapSVG;
  private tooltip!: Tooltip;

  colorPalettes = colorPalettes;
  private currentColorPalette = colorPalettes[0].colors;
  private colorScale!: ColorScale;
  mapBackgroundColor = "rgb(156, 192, 249)";

  @ViewChild("mapWrapper") mapWrapper!: ElementRef<HTMLElement>;

  constructor(private countryService: CountryService) {}

  ngAfterViewInit(): void {
    this.addMap();

    fromEvent(window, "resize")
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 768;
        setTimeout(() => {
          this.updateMap();
        }, 200);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["countriesData"] &&
      changes["artists"] &&
      !changes["countriesData"].isFirstChange() &&
      !changes["artists"].isFirstChange()
    )
      this.updateMap();
  }

  onColorPaletteSelect(event: ListboxClickEvent): void {
    this.currentColorPalette = event.option.colors;
    this.mapBackgroundColor = event.option.background;
    this.setColorScale();
    this.setCountriesColorInMap();
    this.addMapLegend();
  }

  onShareButtonClick(): void {
    this.shareMode = true;
  }

  shareMap(): void {
    this.mapWrapper.nativeElement.style.position = "absolute";
    this.mapWrapper.nativeElement.style.height = this.shareMapResolution.height;
    this.mapWrapper.nativeElement.style.width = this.shareMapResolution.width;
    this.updateMap();

    setTimeout(() => {
      htmlToImage
        .toPng(this.mapWrapper.nativeElement)
        .then((dataUrl) => {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "cartogrify_map";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          this.mapWrapper.nativeElement.style.position = "relative";
          this.mapWrapper.nativeElement.style.height = "100%";
          this.mapWrapper.nativeElement.style.width = "100%";
          this.shareMode = false;
          this.updateMap();
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }, 500);
  }

  shareRanking(): void {
    htmlToImage
      .toPng(document.querySelector(".data-wrapper") as HTMLElement)
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "cartogrify_ranking";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  onChangeDefaultResolutionStatus(): void {
    this.usesDefaultResolution = !this.usesDefaultResolution;
    if (this.usesDefaultResolution) {
      this.shareMapResolution = {
        width: "1920px",
        height: "1080px",
      };
    }
  }

  sendOpenRankingsEvent(): void {
    this.shouldOpenRankings.emit(true);
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

    d3.select(".svg").remove();
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
      .attr("fill", this.currentColorPalette[0]);

    setTimeout(() => {
      const mapMeasures = (document.querySelector("#map") as Element).getBoundingClientRect();
      const mapWrapperMeasures = this.mapWrapper.nativeElement.getBoundingClientRect();

      const mapViewWidthFactor = mapMeasures.width * 0.001;
      const fontSizeDefault = 16 * mapViewWidthFactor;
      const fontSizeBigger = 24 * mapViewWidthFactor;

      this.mapSvg
        .append("text")
        .text("Your map")
        .attr("font-size", fontSizeBigger)
        .attr("fill", this.currentColorPalette[this.currentColorPalette.length - 1])
        .attr("text-anchor", "middle")
        .attr("visibility", this.shareMode ? "visible" : "hidden")
        .attr("transform", `translate(${mapWrapperMeasures.width / 2}, ${mapMeasures.y})`);

      this.mapSvg
        .append("text")
        .text("generated by cartogrify.web.app")
        .attr("font-size", fontSizeDefault)
        .attr("fill", this.currentColorPalette[this.currentColorPalette.length - 1])
        .attr("visibility", this.shareMode ? "visible" : "hidden")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${mapWrapperMeasures.width / 2}, ${
            mapMeasures.y + mapMeasures.height + 24 * mapViewWidthFactor
          })`
        );
    }, 100);
  }

  private getScaleData(): { domain: number[]; range: string[] } {
    const counts = this.countriesData.map((countryData) => countryData.count);
    const domain = [...new Set<number>(counts)].sort((a, b) => a - b);
    const colorPalette = [...this.currentColorPalette];

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
      this.mapSvg.selectAll(".color-label").remove();
      this.mapSvg.selectAll("rect").remove();

      const mapMeasures = (document.querySelector("#map") as Element).getBoundingClientRect();
      const mapViewWidthFactor = mapMeasures.width * 0.001;
      const legendY = mapMeasures.y + mapMeasures.height - 172 * mapViewWidthFactor;
      const legendX = 120 * mapViewWidthFactor;
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
        .attr("fill", this.currentColorPalette[this.currentColorPalette.length - 1])
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
        .attr("fill", this.currentColorPalette[this.currentColorPalette.length - 1])
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

  private setColorScale(): void {
    const { domain, range } = this.getScaleData();
    this.colorScale = d3.scaleThreshold<number, string>().domain(domain).range(range);
  }

  private updateMap(): void {
    this.addMap();
    this.setColorScale();
    this.addMapLegend();
    this.setCountriesColorInMap();
  }
}
