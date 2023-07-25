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
  intermediateRegionName: string;
  count: number;
}

export interface SubRegionData {
  subRegionName: string;
  count: number;
  intermediateRegions: IntermediateRegionData[];
}

export interface RegionData {
  regionName: string;
  count: number;
  subRegions: SubRegionData[];
}
