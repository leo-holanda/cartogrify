import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ArtistService } from "./artist.service";
import { CountriesService } from "../countries/countries.service";
import { BehaviorSubject, map, skip } from "rxjs";
import { SpotifyService } from "../streaming/spotify.service";
import { Artist } from "./artist.model";
import { CountryData, GeoFeature, LabelData, RegionData } from "../countries/country.model";
import * as d3 from "d3";

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
  artists$ = new BehaviorSubject<Artist[]>([]);
  countriesData: CountryData[] = [];
  regionsData: RegionData[] = [];
  selectedData = DataTypes.COUNTRIES;

  DataTypes = DataTypes;

  @ViewChild("mapWrapper") mapWrapper!: ElementRef;

  constructor(
    private spotifyService: SpotifyService,
    private artistService: ArtistService,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.spotifyService.getUserTopArtists().subscribe((topArtists) => {
      const topArtistsNames = topArtists.items.map((artist) => artist.name.toLowerCase());
      this.artistService.getArtistsByName(topArtistsNames).subscribe((artistsFromDatabase) => {
        const artistsWithoutCountry = this.findArtistsWithoutCountry(
          topArtistsNames,
          artistsFromDatabase
        );

        if (artistsWithoutCountry.length > 0) {
          this.countriesService
            .getArtistsCountryOfOrigin(artistsWithoutCountry)
            .subscribe((scrapedArtists) => {
              this.artistService.saveArtists(scrapedArtists);
              this.artists$.next([...artistsFromDatabase, ...scrapedArtists]);
            });
        } else {
          this.artists$.next(artistsFromDatabase);
        }
      });
    });

    this.artists$.subscribe((artists) => {
      this.countriesData = this.countriesService.countCountries(artists);
      this.regionsData = this.countriesService.countRegions(artists);
    });
  }

  ngAfterViewInit(): void {
    this.setMap();
  }

  setSelectedData(dataType: DataTypes): void {
    this.selectedData = dataType;
  }

  private findArtistsWithoutCountry(
    topArtistsNames: string[],
    artistsFromDatabase: Artist[] | null
  ): string[] {
    return topArtistsNames.filter(
      (topArtistName) =>
        !artistsFromDatabase?.some(
          (artistsFromDatabase) => topArtistName === artistsFromDatabase.name
        )
    );
  }

  private setMap() {
    const height = this.mapWrapper.nativeElement.offsetHeight as number;
    const width = this.mapWrapper.nativeElement.offsetWidth as number;
    const margin = 32;

    const geoJSON = this.countriesService.geoJSON;

    const projection = d3
      .geoNaturalEarth1()
      .fitSize([width - margin, height - margin], geoJSON as unknown as d3.GeoGeometryObjects);

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

    const svg = d3
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

    this.artists$.pipe(skip(1)).subscribe((artists) => {
      const colorPalette = [
        "#f1eef6",
        "#d0d1e6",
        "#a6bddb",
        "#74a9cf",
        "#3690c0",
        "#0570b0",
        "#034e7b",
      ];

      const colorScaleDomain = this.getColorScaleDomain();
      const colorScale = d3
        .scaleThreshold<number, string>()
        .domain(colorScaleDomain)
        .range(colorPalette);

      const colorLabels: LabelData[] = colorPalette.map((color) => {
        return {
          min: colorScale.invertExtent(color)[0],
          max: colorScale.invertExtent(color)[1],
          fill: color,
        };
      });

      const labelsWrapper = svg
        .append("g")
        .attr("id", "labelsWrapper")
        .attr("transform", "translate(16, 0)");
      labelsWrapper.selectAll("g").data(colorPalette).enter().append("g");
      labelsWrapper
        .append("text")
        .text("Color per artists quantity")
        .attr("transform", "translate(0, -16)");

      labelsWrapper
        .selectAll("g")
        .data(colorLabels)
        .append("rect")
        .attr("id", (d, i) => "rect" + i)
        .attr("fill", (d) => d.fill)
        .attr("width", "1.5rem")
        .attr("height", "1.5rem")
        .attr("transform", (d, i) => `translate(0,${i * 28})`);

      labelsWrapper
        .selectAll("g")
        .data(colorLabels)
        .append("text")
        .attr("transform", (d, i) => {
          const rectCoordinates = (
            document.querySelector("#rect" + i) as Element
          ).getBoundingClientRect();
          return `translate(${32},${rectCoordinates.y + 16})`;
        })
        .text((d) => this.getColorLabelText(d) || null);

      svg
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

          return colorScale(currentCountry ? currentCountry.count : 0);
        })

        .on("mouseenter", (event) => {
          const countryName = event.srcElement.getAttribute("country-name");
          const countryFlagCode = event.srcElement.getAttribute("country-flag-code");

          const artistsFromCountry = artists
            .filter((artist) => artist.country?.flagCode === countryFlagCode)
            .map((artist) => artist.name);

          let countryTag = `
            <div> 
              <span class="fi fi-${countryFlagCode} flag"></span>
              <span>
                ${countryName}
              </span> 
            </div>
          `;

          artistsFromCountry.forEach((artistName) => {
            const artistTag = document.createElement("div");
            artistTag.innerHTML = artistName;
            countryTag += artistTag.outerHTML;
          });

          if (artistsFromCountry.length === 0) countryTag += "No artists here.";

          tooltip.style("top", event.pageY + "px").style("left", event.pageX + "px");
          tooltip.style("visibility", "visible");
          tooltip.html(countryTag);
        })
        .on("mouseover", (event) => {
          tooltip.style("top", event.pageY + "px").style("left", event.pageX + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

      const labelsWrapperHeight = (
        document.querySelector("#labelsWrapper") as Element
      ).getBoundingClientRect().height;

      const mapCoordinates = (document.querySelector("#map") as Element).getBoundingClientRect();

      labelsWrapper.attr(
        "transform",
        `translate(16, ${mapCoordinates.y + mapCoordinates.height - labelsWrapperHeight})`
      );
    });
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
}
