export interface Country {
  name: string;
  code: string;
  code3: string;
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
