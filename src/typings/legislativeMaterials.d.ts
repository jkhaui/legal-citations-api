export interface ILegislativeMaterials {
  max_results: number | null;
  source_type: string;
  title: string;
  jurisdiction: string | null;
  year: string | null;
}

export interface IStatutesArgs {
  title: string;
  max_results: number;
}

export type LegislativeMaterialSourceType =
  'australian_constitutions' | 'bills' | 'statutes';