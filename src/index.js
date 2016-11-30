import { getConnection, getCurrentVersion } from './engine';
import { getMigrationsToRun } from './migrations-file';

export const migrate = (db, migrationsDirectory) => {
  const conn = getConnection(db);
  return getCurrentVersion(conn)
    .then((currentVersion) => getMigrationsToRun(currentVersion, migrationsDirectory))
    .then((migrations) => console.log(JSON.stringify(migrations, null, 2)));
};
