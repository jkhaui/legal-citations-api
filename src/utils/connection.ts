import Client from 'serverless-mysql';
// @ts-ignore
export const client = Client({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.DB_NAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});