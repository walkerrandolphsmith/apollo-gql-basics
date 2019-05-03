const path = require('path');
const register = require('@babel/register');

register({
  configFile: path.resolve(__dirname, '../babel/babel.config.js'),
});
