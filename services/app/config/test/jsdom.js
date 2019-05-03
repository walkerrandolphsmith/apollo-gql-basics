var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
}).window;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = document;
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
