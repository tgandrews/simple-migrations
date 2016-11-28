import { native as pg } from 'pg';
import { parse } from 'pg-connection-string';

export const getConnection = (connectionString) => {
  return new pg.Pool(parse(connectionString));
};

const execute = (conn, query, params) => {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const getCurrentVersion = (conn) =>
  execute(conn, `
    CREATE TABLE IF NOT EXISTS _migrations (
	   current_version text NOT NULL
   );

   select current_version from _migrations;`
 )
 .then((result) => {
   const rows = result.rows;
   if (rows.length === 0) {
     return null;
   }
   return rows[0].current_version;
 });
