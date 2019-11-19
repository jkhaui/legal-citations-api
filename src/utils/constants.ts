export const CONNECTION_TIMEOUT = 9000;
export const MAX_RESULTS = 5;

export const URL_REGEX = /.*\.(com|net|org|co)(\.au|\.uk)?/i;
export const YEAR_REGEX = /\d{4}-\d{2}-\d{2}/;
export const UTC_YEAR_REGEX = /^\d{4}(?=-)/;
export const CORPORATE_NAMES_REGEX =
  /(\b(who|company|Journal|lexisnexis|society|national|welfare|association|advancement|federal|business|academia|science|scientific|international|australia|america|reuters|limited|ltd|commission|oecd|world health|legal|casenote|research|economic|european|university|oup|committee|social|department|united|institute|education|council|review|hbr|initiative|studies|study|affairs)\b|((.*)\sof\s(.*)|(^Kaplan$)))/gi;

export const CONSTITUTION_API = process.env.CONSTITUTION_API;
export const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
export const GOOGLE_BOOKS_API_URL =
  'https://www.googleapis.com/books/v1/volumes?q=';

export const AUSTRALIAN_CONSTITUTIONS = 'australian_constitutions';
export const BILLS = 'bills';
export const STATUTES = 'statutes';
export const CTH = 'Cth';

export const LEGISLATIVE_MATERIALS_ERROR_MSG =
  'Please provide a search term along with your query. E.g. ' +
  '`legislative_materials { bills(title: "civil aviation' +
  ' amendment") {...}}`';
export const CASES_ERROR_MESSAGE =
  'Please provide a case name to search for.';
export const TREATIES_ERROR_MSG = 'Please provide the title of a treaty to' +
  ' search for';
export const STATUTES_ERROR_MSG = 'Please provide the title of a statute to' +
  ' search for';
export const JURISDICTION_ERROR_MSG =
  'The jurisdiction parameter must be one of \'vic\',' +
  ' \'nsw\', \'qld\', \'sa\', \'nt\', \'act\' or \'tas\'. Leave blank' +
  ' to search all Australian cases.';
