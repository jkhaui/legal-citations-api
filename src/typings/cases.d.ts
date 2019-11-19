export interface ICaseArgs {
  case_name: string;
  citation: string;
  jurisdiction: string;
  max_results: number;
}

export interface ICases {
  alt_citations: IAltCitations;
}

export interface IAltCitations {
  length: number | never[];
  split?: (delimiter: string) => string[];
}