mocha \
--require @babel/register \
--require ignore-styles \
--require ./config/test/setup.js \
--require ./config/test/enzyme.js \
--require ./config/test/jsdom.js \
--recursive ./src/**/*.spec.js
