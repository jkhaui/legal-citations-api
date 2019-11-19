import { GraphQLServerLambda } from 'graphql-yoga';
// Must include this module to locate `schema.graphql` from the root
// directory after being built with webpack.
import { readFileSync } from 'fs';

import {
  bookHandler,
  caseHandler,
  legislativeMaterialHandler,
  treatyHandler,
} from './src/resolvers';

const typeDefs =
  readFileSync('./schema.graphql').toString('utf-8');

const resolvers = {
  Query: {
    books: bookHandler,
    cases: caseHandler,
    legislative_materials: () => (
      {}
    ),
    treaties: treatyHandler,
  },
  Legislative_Materials: {
    australian_constitutions: legislativeMaterialHandler,
    bills: legislativeMaterialHandler,
    bills_digests: legislativeMaterialHandler,
    statutes: legislativeMaterialHandler,
  },
};

const lambda = new GraphQLServerLambda({
  typeDefs,
  resolvers,
});

exports.server = lambda.graphqlHandler;
exports.playground = lambda.playgroundHandler;