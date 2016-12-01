import { join } from 'path';
import { readFile } from 'fs';

const getContents = (path) =>
  new Promise((resolve, reject) => {
    readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

const getLines = (data) =>
  data.split('\n')
    .map((l) => l.trim())
    .filter(Boolean);


const getListOfMigrationNames = (directory) => {
  const orderFile = join(directory, '.migrations');
  return getContents(orderFile)
    .then(getLines);
};

const getMigrationsAfterCurrent = (names, currentVersion) => {
  let index = 0;
  if (currentVersion) {
    index = names.indexOf(currentVersion);
  }
  return names.slice(index + 1);
};

const populateMigrationDetails = (names, directory) => {
  const getMigrationDetails = names.map((name) => {
    const path = join(directory, name, 'up.sql');
    return getContents(path);
  });
  return Promise.all(getMigrationDetails)
    .then((contents) => {
      return names.map((name, index) => {
        const path = join(directory, name, 'up.sql');
        const script = contents[index];
        return { name, script, path };
      });
    });
};

export const getMigrationsToRun = (currentVersion, directory) =>
  getListOfMigrationNames(directory)
    .then((names) => getMigrationsAfterCurrent(names, currentVersion))
    .then((names) => populateMigrationDetails(names, directory));
