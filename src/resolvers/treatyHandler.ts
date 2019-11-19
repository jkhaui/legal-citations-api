import { client } from '../utils/connection';
import {
  CONNECTION_TIMEOUT, MAX_RESULTS,
  TREATIES_ERROR_MSG
} from '../utils/constants';

import { ITreatyArgs } from '../typings/treaties';
import { filterTypenameField } from '../utils/utils';

export const treatyHandler = async (
  _parent: any,
  args: ITreatyArgs,
  _ctx: any,
  info: any
) => {
  let requestedFields = filterTypenameField(info);
  const {
    treaty_title,
    party_names
  } = args;
  let { max_results } = args;

  if (!treaty_title) {
    throw new Error(TREATIES_ERROR_MSG);
  }
  if (!max_results) {
    max_results = MAX_RESULTS;
  }

  let treatyData;
  if (!party_names) {
    treatyData = await client.query({
      sql: `
        select ${requestedFields}
        from treaties
        where treaty_title
        like ?
        limit ${max_results}
      `,
      timeout: CONNECTION_TIMEOUT,
      values: `%${treaty_title}%`
    });
  } else {
    treatyData = await client.query({
      sql: `
        select ${requestedFields}
        from treaties
        where treaty_title
        like ?
        and party_names
        like ?
        limit ${max_results}
      `,
      timeout: CONNECTION_TIMEOUT,
      values: [`${treaty_title}%`, `${party_names}%`]
    });
  }
  client.quit();
  const { length } = treatyData;
  if (!length) {
    return null;
  }
  return treatyData;
};