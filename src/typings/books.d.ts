export interface IAuthors {
  trim: () => {
    replace: (arg0: string, arg1: string) => void;
  }
}

export interface IBook {
  volumeInfo?: any;
  title?: any;
  short_title?: string | null;
  authors_bibliography: string[];
  authors_footnote: string[];
  authors?: any;
  publication_details?: string;
  get(volumeInfo: string): any;
}

export interface IAuthorNames {
  join: () => {
    indexOf: (arg0: string) => number;
  };
  indexOf: (x: string) => any;
}

export interface IAuthorNameStrings {
  footnote: string,
  bibliography: string
}

export interface IBookArgs {
  title: string;
  max_results: number;
  authors: string;
}