import { getConnection, getCurrentVersion } from './engine';

export const migrate = (db) => {
  const conn = getConnection(db);
  return getCurrentVersion(conn)
    .then((cv) => console.log(`Current version: ${cv}`));
};
