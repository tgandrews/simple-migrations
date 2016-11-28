/* eslint-disable no-console */
const epicMigrations = require('../lib/index.js');
const dbString = 'postgresql://postgres:postgres@localhost:6432/app';
epicMigrations.migrate(dbString, './migrations')
  .then(() => console.log('All swell, migrations complete'))
  .catch((e) => console.error(e.stack));
