import { native as pg } from 'pg';
import { parse } from 'pg-connection-string';

export const getConnection = (connectionString) => {
  return new pg.Pool(parse(connectionString));
};

const execute = (conn, query, params) => {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
      return;
    });
  });
};

export const getCurrentVersion = (conn) =>
  execute(conn, `
    CREATE TABLE IF NOT EXISTS _migrations (
      current_version text
    );

    DO LANGUAGE plpgsql $$
      BEGIN
      IF (SELECT COUNT(*) FROM _migrations) < 1 THEN
        INSERT INTO _migrations (current_version) VALUES (null);
      END IF;
      END;
    $$;

    SELECT current_version FROM _migrations LIMIT 1;`
 )
 .then((result) => {
   const rows = result.rows;
   if (rows.length === 0) {
     return null;
   }
   return rows[0].current_version;
 });

const migrate = (conn, migration) => {
  const updateVersion = `UPDATE _migrations SET current_version = '${migration.name}';`;
  const query = ['BEGIN;', migration.script, updateVersion, 'COMMIT;'].join('\n');
  return execute(conn, query)
    .catch((e) => {
      return execute(conn, 'ROLLBACK')
        .then(() => Promise.reject(e));
    });
};

export const runMigrations = (conn, migrations) =>
  migrations.reduce((chain, migration) =>
    chain.then(() =>
      migrate(conn, migration)
    ), Promise.resolve())
    .then(() => conn.end())
    .catch((e) => {
      conn.end();
      return Promise.reject(e);
    });
