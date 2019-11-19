import { client } from '../utils/connection';
import {
  CONNECTION_TIMEOUT,
  MAX_RESULTS,
  CASES_ERROR_MESSAGE,
  JURISDICTION_ERROR_MSG,
  CTH,

} from '../utils/constants';

import { IAltCitations, ICaseArgs, ICases } from '../typings/cases';
import { filterTypenameField } from '../utils/utils';

export const caseHandler = async (
  _parent: any,
  args: ICaseArgs,
  _ctx: any,
  info: any,
) => {
  const { case_name, citation } = args;
  let requestedFields = filterTypenameField(info);
  let {
    max_results,
    jurisdiction,
  } = args;

  if (!case_name) {
    throw new Error(CASES_ERROR_MESSAGE);
  }
  if (!max_results) {
    max_results = MAX_RESULTS;
  }

  if (jurisdiction) {
    if (!/^(vic|nsw|qld|sa|nt|act|tas|wa)$/.test(jurisdiction)) {
      throw new Error(JURISDICTION_ERROR_MSG);
    }
    jurisdiction =
      `and jurisdiction = '${CTH}: ${jurisdiction}'`;
  } else {
    jurisdiction = '';
  }

  // SQL query within template literals MUST be lower-case.
  let caseData;
  if (!citation) {
    caseData = await client.query({
      sql: `
        select ${requestedFields}
        from cases_australia
        where case_name
        like ?
        ${jurisdiction}
        order by alt_citations
        desc
        limit ${max_results}
      `,
      timeout: CONNECTION_TIMEOUT,
      values: `%${case_name}%`,
    });
  } else {
    caseData = await client.query({
      sql: `
        select ${requestedFields}
        from cases_australia
        where case_name
        like ?
        ${jurisdiction}
        and citation
        like ?
        order by alt_citations
        desc
        limit ${max_results}
      `,
      timeout: CONNECTION_TIMEOUT,
      values: [
        `%${case_name}%`,
        `%${citation}%`,
      ],
    });
  }
  client.quit();
  const { length } = caseData;
  if (!length) {
    return null;
  }

  if (requestedFields.indexOf('alt_citations') === -1) {
    return caseData;
  }

  return caseData.map((cases: ICases) => ({
    ...cases,
    alt_citations: modifyAltCitations(cases.alt_citations),
  }));
};

const modifyAltCitations = (altCitations: IAltCitations) => {
  if (!altCitations) {
    return null;
  }

  const { length } = altCitations;
  length
    ? altCitations = altCitations.split!(', ')
    : altCitations = [];

  return altCitations;
};