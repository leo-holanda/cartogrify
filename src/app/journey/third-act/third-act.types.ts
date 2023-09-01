import { Country } from "src/app/country/country.model";

export interface TreeNode {
  name: string;
  count: number;
  children: (TreeNode | TreeLeaf)[];
}

export interface TreeLeaf {
  country: Country;
  count: number;
}
