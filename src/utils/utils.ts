import { fieldsList } from 'graphql-fields-list';

/**
 * Filters and returns only the fields queried by the client.
 */
export const filterTypenameField = (fields: any) => {
  fields = fieldsList(fields).join(', ');

  return fields.indexOf('__typename') !== -1
    ? fields.replace(/(,\s)?__typename/, '')
    : fields;
};