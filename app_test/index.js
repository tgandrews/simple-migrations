/* eslint-disable no-console */
const path = require('path');
const epicMigrations = require('../lib/index.js');
const dbString = 'postgresql://postgres:postgres@localhost:6432/app';
epicMigrations.migrate(dbString, path.resolve(__dirname, './migrations'))
  .then(() => console.log('All swell, migrations complete'))
  .catch((e) => console.error(e.stack));
