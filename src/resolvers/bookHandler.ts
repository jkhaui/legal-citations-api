import fetch from 'node-fetch';
import { fromJS, Seq } from 'immutable';

import {
  GOOGLE_BOOKS_API_KEY,
  GOOGLE_BOOKS_API_URL,
  MAX_RESULTS,
} from '../utils/constants';
import {
  cleanPublishedDate,
  cleanPublisher,
  setAuthorNames,
} from '../utils/formattingMethods';

import { IAuthors, IBook, IBookArgs } from '../typings/books';

const getBookCitations = async (
  max_results: number,
  title: string,
  authors: IAuthors,
) => {
  title = encodeURIComponent(title.trim());
  let ENDPOINT =
    `${GOOGLE_BOOKS_API_URL}${title}&key=${GOOGLE_BOOKS_API_KEY}`;

  if (authors) {
    authors = encodeURIComponent(authors.trim() as string);
    ENDPOINT = `${
      GOOGLE_BOOKS_API_URL
    }${title}+inauthor:${authors}&key=${
      GOOGLE_BOOKS_API_KEY
    }`;
  }

  return fetch(ENDPOINT)
    .then(response => {
      return response.json();
    })
    .then(response => {
      const { items } = response;
      if (!items) {
        return null;
      }

      const books = fromJS(items);
      // Lazily manipulate our array.
      return Seq(books)
      // Return a subset of results.
        .slice(0, max_results)
        .map((book: IBook) => {
          const volumeInfo = book.get('volumeInfo');

          const title = volumeInfo.get('title');
          const authors = volumeInfo.get('authors');
          const publishedDate = volumeInfo.get('publishedDate');
          const publisher = volumeInfo.get('publisher');

          let authorsAsFootnote;
          let authorsAsBibliography;

          const authorNames = setAuthorNames(authors);

          if (authorNames) {
            authorsAsFootnote = [authorNames.footnote];
            authorsAsBibliography = [authorNames.bibliography];
          } else {
            authorsAsFootnote = null;
            authorsAsBibliography = null;
          }

          return {
            title: title,
            authors_footnote: authorsAsFootnote,
            authors_bibliography: authorsAsBibliography,
            publication_details: `(${
              cleanPublisher(publisher)
            }${
              cleanPublishedDate(publishedDate)
            })`,
          };
        });
    });
};

export const bookHandler = async (_parent: any, args: IBookArgs) => {
  const { title, authors } = args;

  let { max_results } = args;
  if (!max_results) {
    max_results = MAX_RESULTS;
  }

  return await getBookCitations(max_results, title, authors);
};