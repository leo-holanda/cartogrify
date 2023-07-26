import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ArtistService } from "./artist.service";
import { CountriesService } from "../countries/countries.service";
import { BehaviorSubject, skip } from "rxjs";
import { SpotifyService } from "../streaming/spotify.service";
import { Artist } from "./artist.model";
import { CountryData, RegionData } from "../countries/country.model";
import * as d3 from "d3";
import { countriesCodes, countriesGeoData } from "../countries/countries.data";

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

    const projection = d3
      .geoNaturalEarth1()
      .fitSize([width - margin, height - margin], countriesGeoData as d3.GeoGeometryObjects);

    const path = d3.geoPath().projection(projection);

    const zoom = d3.zoom().on("zoom", (event) => {
      d3.select("svg g").attr("transform", event.transform);
    });

    const svg = d3
      .select(".map-wrapper")
      .append("svg")
      .attr("class", "svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("aspect-ratio", "auto")
      .call(zoom as any);

    const colorScale = d3
      .scaleThreshold<number, string>()
      .domain([0, 1, 2, 3])
      .range(d3.schemeBlues[3]);

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
      svg
        .append("g")
        .selectAll("path")
        .data(countriesGeoData.features)
        .join("path")
        .attr("d", path as any)
        .attr("country-name", (d) => d.properties.name)
        .attr("country-code", (d) => d.id)
        .attr("fill", (d) => {
          const currentCountry = this.countriesData.find((countryData) => {
            return countryData.country.name === d.properties.name;
          });

          return colorScale(currentCountry ? currentCountry.count : 0);
        })
        .on("mouseenter", (event) => {
          const countryName = event.srcElement.getAttribute("country-name");
          const countryCode = event.srcElement.getAttribute("country-code");

          const artistsFromCountry = artists
            .filter((artist) => artist.country?.code3 === countryCode)
            .map((artist) => artist.name);

          let countryTag = `
            <div> 
              <span class="fi fi-${countriesCodes[countryCode].toLowerCase()} flag"></span>
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
          console.log("mouseover");
          tooltip.style("top", event.pageY + "px").style("left", event.pageX + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    });
  }
}
