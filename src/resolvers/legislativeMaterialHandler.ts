import 'node-fetch';

import { client } from '../utils/connection';
import { filterTypenameField } from '../utils/utils';

import {
  AUSTRALIAN_CONSTITUTIONS,
  BILLS,
  CONNECTION_TIMEOUT,
  CONSTITUTION_API,
  CTH,
  LEGISLATIVE_MATERIALS_ERROR_MSG,
  MAX_RESULTS,
  STATUTES,

} from '../utils/constants';

import {
  ILegislativeMaterials,
  LegislativeMaterialSourceType,
} from '../typings/legislativeMaterials';

export const legislativeMaterialHandler = async (
  _parent: any,
  args: ILegislativeMaterials,
  _ctx: any,
  info: any,
) => {
  let requestedFields = filterTypenameField(info);
  const sourceType = info.fieldName;
  const { title } = args;

  if (!title) {
    throw new Error(LEGISLATIVE_MATERIALS_ERROR_MSG);
  }

  let response;
  // We can skip checking for arguments if the source type is the constitution.
  if (sourceType !== AUSTRALIAN_CONSTITUTIONS) {
    let {
      max_results,
      jurisdiction,
      year,
    } = args;

    max_results = max_results || MAX_RESULTS;
    jurisdiction = jurisdiction || CTH;

    !year ? year = '' : year = `and year = '${year}'`;

    response = await getLegislativeMaterial(
      title,
      sourceType,
      requestedFields,
      client,
      max_results,
      jurisdiction,
      year,
    );
    client.quit();
  } else {
    response = await getLegislativeMaterial(
      title,
      sourceType,
      requestedFields,
    );
  }
  return response;
};

const getLegislativeMaterial = async (
  title: string,
  sourceType: LegislativeMaterialSourceType,
  requestedFields: string,
  client?: any,
  max_results?: number | null,
  jurisdiction?: string | null,
  year?: string | null,
) => {
  let legislativeMaterialData;

  switch (sourceType) {
    case BILLS:
      legislativeMaterialData = await client.query({
        sql: `
          select ${requestedFields}
          from bills2
          where title
          like ?
          and jurisdiction = ?
          ${year}
          order by year
          desc
          limit ${max_results}
        `,
        timeout: CONNECTION_TIMEOUT,
        values: [`${title}%`, `(${jurisdiction})`],
      });
      break;
    case AUSTRALIAN_CONSTITUTIONS:
      await fetch(CONSTITUTION_API + title)
        .then(response => {
          return response.json();
        })
        .then(response => {
          const { section, title, state } = response;
          legislativeMaterialData = [{
            title: title,
            section_number: section,
            jurisdiction: state,
          }];
          return legislativeMaterialData;
        });
      break;
    case STATUTES:
      legislativeMaterialData = await client.query({
        sql: `
        select ${requestedFields}
        from statutes_cth
        where title
        like ?
        limit ${max_results}
      `,
        timeout: CONNECTION_TIMEOUT,
        values: `%${title}%`,
      });
      break;
  }

  const { length } = legislativeMaterialData;
  if (!length) {
    return null;
  }

  return legislativeMaterialData;
};