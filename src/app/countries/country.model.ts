export interface Country {
  name: string;
  flagCode: string;
  region: string | undefined;
  subRegion: string | undefined;
  intermediateRegion: string | undefined;
}

export interface CountryData {
  country: Country;
  count: number;
}

export interface IntermediateRegionData {
  name: string;
  count: number;
}

export interface SubRegionData {
  name: string;
  count: number;
  intermediateRegions: IntermediateRegionData[];
}

export interface RegionData {
  name: string;
  count: number;
  subRegions: SubRegionData[];
}

export type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, NonNullable<GeoJSON.GeoJsonProperties>>;

export type GeoFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  NonNullable<GeoJSON.GeoJsonProperties>
>;
