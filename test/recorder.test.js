var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

test('Scrape Profile and Save Record in ElasticSearch', function(t) {
  var username = 'iteles';
  gs(username, function(err, data){
    t.ok(data.url === 'https://github.com/iteles', "✓ Profile scraped: "+username);
    recorder(data, function(res){
      t.ok(res._version > 0, "✓ Record created: " + res._id);
      t.ok(res._type === 'person', "✓ Record type is: " + res._type);
      t.end();
    })
  })
});

test('Add list of followers to Profile Record', function(t) {
  var username = 'iteles/followers';
  gs(username, function(err, data) {
    t.ok(data.url === 'https://github.com/iteles', "✓ Profile scraped: "+username);
    recorder(data, function(res){
      t.ok(res._version > 0, "✓ Record created: " + res._id);
      t.ok(res._type === 'person', "✓ Record type is: " + res._type);
      t.end();
    })
  })
});

// test('Add list of followers to Profile Record', function(t) {
//   var username = 'iteles';
//   gs(username, function(err, data){
//     t.ok(data.url === 'https://github.com/iteles', "✓ Profile scraped: "+username);
//     recorder(data, function(res){
//       t.ok(res._version > 0, "✓ Record created: " + res._id);
//       t.ok(res._type === 'person', "✓ Record type is: " + res._type);
//       t.end();
//     })
//   })
// });
