// fetching private methods from a dependency is probably not a best practice...
// but given I *WROTE* it and its not going to change, its pretty safe.
var OPTIONS = require('../node_modules/esta/lib/options');
var REQUEST = require('../node_modules/esta/lib/http_request');

// DO NOT EXPOSE THIS METHOD IN ANY PUBLIC API!!!
module.exports = function(record, callback) { //!
  var options = OPTIONS(record, 'DELETE');    //!
  options.path = "/_all"; // DELETEs EVERYTHING!!
  return REQUEST(options, callback);    //!
} // *ONLY* USE THIS IN YOUR *TESTS*! SERIOUSLY!!
