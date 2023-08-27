export interface Country {
  name: string;
  flagCode: string;
  region: string | undefined;
  subRegion: string | undefined;
  intermediateRegion: string | undefined;
  NE_ID: number;
}

export interface CountryData {
  country: Country;
  count: number;
}

export interface SubRegionData {
  name: string;
  count: number;
}

export interface IntermediateRegionData {
  name: string;
  count: number;
  subRegions: SubRegionData[];
}

export interface RegionData {
  name: string;
  count: number;
  intermediateRegions: IntermediateRegionData[];
}

export type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, NonNullable<GeoJSON.GeoJsonProperties>>;

export type GeoFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  NonNullable<GeoJSON.GeoJsonProperties>
>;

export interface LabelData {
  min: number | undefined;
  max: number | undefined;
  fill: string;
}

export type ColorScale = d3.ScaleThreshold<number, string, never>;

export type MapSVG = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

export type Tooltip = d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

export interface PossibleCountry {
  count: number;
  geoFeature: GeoFeature;
}

export interface DiversityStatistics {
  average: number;
}
