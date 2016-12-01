import { getConnection, getCurrentVersion, runMigrations } from './engine';
import { getMigrationsToRun } from './migrations-file';

export const migrate = (db, migrationsDirectory) => {
  const conn = getConnection(db);
  return getCurrentVersion(conn)
    .then((currentVersion) => getMigrationsToRun(currentVersion, migrationsDirectory))
    .then((migrations) => runMigrations(conn, migrations));
};
