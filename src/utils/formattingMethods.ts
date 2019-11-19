import { List } from 'immutable';
import {
  CORPORATE_NAMES_REGEX,
  URL_REGEX,
  UTC_YEAR_REGEX,
  YEAR_REGEX,
} from './constants';

import { IAuthorNameStrings } from '../typings/books';

/**
 * Utility function to check for and remove undesirable substrings.
 */
export const cleanPublisher = (publisher: string): string => {
  if (!publisher) {
    return publisher = '';
  }

  if (URL_REGEX.test(publisher)) {
    return publisher = publisher.replace(URL_REGEX, '');
  }

  return `${publisher}, `;
};

/**
 * Checks for empty dates; returns a string with the date in AGLC4 format.
 */
export const cleanPublishedDate = (publishedDate: string): string => {
  if (!publishedDate) {
    return publishedDate = 'n.d.';
  }

  return convertUTCToDate(publishedDate);
};

/**
 * Converts UTC dates from the Google Books API to AGLC4 format.
 */
const convertUTCToDate = (date: string): string => {
  let formattedDate;

  if (new RegExp(YEAR_REGEX).test(date)) {
    return formattedDate = date.match(UTC_YEAR_REGEX)![0];
  } else {
    formattedDate = date.trim();

    return formattedDate;
  }
};

/**
 * Breaks up a contiguous string of names into a first, middle (if it
 * exists) and last name.
 */
export const splitNames = (name: string) => {
  const prohibitedWords = name.match(CORPORATE_NAMES_REGEX);
  const names = name.split(' ');
  const _names = [];
  const mergedNames: any[] = [];
  // Handle 'double-barrelled' surnames so they are not split into middle and
  // last names. E.g. 'Ter Stegen', 'St. John'.
  const doubleBarrelledNames =
    List(['de', 'del', 'dos', 'du', 'el',
      'ter', 'ten', 'van', 'von', 'st', 'st.']);

  const { length } = names;
  for (let i = 0; i < length; i++) {
    if (mergedNames.includes(String(i))) {
      continue;
    }
    // Convert returned author names to lower case.
    // Then check the split names index for matches with double-barrelled
    // surnames.
    if (doubleBarrelledNames.includes(names[i].toLowerCase())) {
      _names.push(`${names[i]} ${names[i + 1]}`);
      mergedNames.push(String(i + 1));
    } else {
      // Strip periods in accordance with AGLC4 rules.
      _names.push(names[i].replace(/\./g, ''));
    }
  }

  let allNames: {
    [index: string]: {}
  } = {
    firstName: typeof _names[0] !== 'undefined' ? _names[0] : '',
  };

  if (prohibitedWords) {
    allNames['coy'] = name;
  }

  // Check if the author has a middle name.
  if (_names.length > 2) {
    allNames['middleName'] = _names[1];
    allNames['lastName'] = _names[2];
  } else {
    allNames['middleName'] = '';
    allNames['lastName'] = _names[1];
  }

  return allNames;
};

/**
 * Recombines author names into two separate strings, properly formatted for
 * the footnotes and bibliography sections of a document conforming to AGLC4
 * style.
 */
export const setAuthorNames = (authorsImmutable: any) => {
  // TODO: Handle names with `Jr` appended at the end.
  //  E.g. https://api.aglc4.com/y/book-gb?title=louisiana+law+and+torts
  let authors = [];

  if (authorsImmutable) {
    authors = authorsImmutable.toJS();

    let footnote = '';
    let bibliography = '';
    let authorNamesAsStrings: IAuthorNameStrings = {
      footnote,
      bibliography,
    };

    // TODO: create proper typings for author names.
    let firstAuthor: any = {};
    let secondAuthor: any = {};
    let thirdAuthor: any = {};

    if (authors[0]) {
      firstAuthor = splitNames(authors[0].trim());
    }
    if (authors[1]) {
      secondAuthor = splitNames(authors[1].trim());
    }
    if (authors[2]) {
      thirdAuthor = splitNames(authors[2].trim());
    }

    const { length } = authors;
    switch (length) {
      case 1:
        // If the response provided by the Google Books API does not contain
        // a last name, the data is likely inaccurate so we omit the record.
        if (!firstAuthor.lastName) {
          return;
        }
        if (firstAuthor.middleName) {
          // Check if first and middle names are single-letter initials,
          // which are formatted without whitespace separating them.
          if (
            firstAuthor.firstName.length === 1 &&
            firstAuthor.middleName.length === 1
          ) {
            authorNamesAsStrings.footnote =
              `${firstAuthor.firstName}${firstAuthor.middleName} ${
                firstAuthor.lastName}`;
            authorNamesAsStrings.bibliography =
              `${firstAuthor.lastName}, ${
                firstAuthor.firstName}${firstAuthor.middleName}`;
            // If there is a full middle name (i.e. without initials),
            // separate the names with whitespace.
          } else {
            authorNamesAsStrings.footnote =
              `${firstAuthor.firstName} ${
                firstAuthor.middleName} ${firstAuthor.lastName}`;
            authorNamesAsStrings.bibliography =
              `${firstAuthor.lastName}, ${firstAuthor.firstName} ${
                firstAuthor.middleName}`;
          }
          // ...or else return formatting with no middle name present.
        } else {
          authorNamesAsStrings.footnote =
            `${firstAuthor.firstName} ${firstAuthor.lastName}`;
          authorNamesAsStrings.bibliography =
            `${firstAuthor.lastName}, ${firstAuthor.firstName}`;
        }

        return authorNamesAsStrings;
      case 2:
        // TODO: Reformat other names as per the template above.
        authorNamesAsStrings.footnote = `${firstAuthor.firstName}${
          firstAuthor.middleName !== ''
            ? ` ${firstAuthor.middleName} `
            : ' '
        }${firstAuthor.lastName} and ${secondAuthor.firstName}${
          secondAuthor.middleName !== ''
            ? ` ${secondAuthor.middleName} `
            : ' '
        }${secondAuthor.lastName}`;
        authorNamesAsStrings.bibliography =
          `${firstAuthor.lastName}, ${firstAuthor.firstName}${
            firstAuthor.middleName !== ''
              ? ` ${firstAuthor.middleName}`
              : ''
          } and ${secondAuthor.firstName}${
            secondAuthor.middleName !== ''
              ? ` ${secondAuthor.middleName} `
              : ' '
          }${secondAuthor.lastName}`;

        return authorNamesAsStrings;
      case 3:
        authorNamesAsStrings.footnote = `${firstAuthor.firstName}${
          firstAuthor.middleName !== ''
            ? ` ${firstAuthor.middleName} `
            : ' '
        }${firstAuthor.lastName}, ${secondAuthor.firstName}${
          secondAuthor.middleName !== ''
            ? ` ${secondAuthor.middleName} `
            : ' '
        }${secondAuthor.lastName} and ${thirdAuthor.firstName}${
          thirdAuthor.middleName !== ''
            ? ` ${thirdAuthor.middleName} `
            : ' '
        }${thirdAuthor.lastName}`;
        authorNamesAsStrings.bibliography =
          `${firstAuthor.lastName}, ${firstAuthor.firstName}${
            firstAuthor.middleName !== ''
              ? ` ${firstAuthor.middleName}`
              : ''
          }, ${secondAuthor.firstName}${
            secondAuthor.middleName !== ''
              ? ` ${secondAuthor.middleName} `
              : ' '
          }${secondAuthor.lastName} and ${thirdAuthor.firstName}${
            thirdAuthor.middleName !== ''
              ? ` ${thirdAuthor.middleName} `
              : ' '
          }${thirdAuthor.lastName}`;

        return authorNamesAsStrings;
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
        authorNamesAsStrings.footnote = `${firstAuthor.firstName}${
          firstAuthor.middleName !== ''
            ? ` ${firstAuthor.middleName} `
            : ' '
        }${firstAuthor.lastName} et al`;
        authorNamesAsStrings.bibliography =
          `${firstAuthor.lastName}, ${firstAuthor.firstName}${
            firstAuthor.middleName !== ''
              ? ` ${firstAuthor.middleName}`
              : ''
          }, et al`;

        return authorNamesAsStrings;
    }
  }
};