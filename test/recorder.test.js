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
      var profile_meta = {
        id: res._id,
        type: res._type,
        index: res._index
      }
      es.read(profile_meta, function(res2){
        t.ok(res2.found, "✓ Record Found: " +res2._id);
        // console.log(res2);
        t.end();
      })

    })
  })
});

test('RECORDER save ORG page data', function(t) {
  var url = 'dwyl';
  gs(url, function(err, data){
    t.ok(data.url === 'https://github.com/dwyl', "✓ Org scraped: "+url);
    recorder(data, function(res){
      // console.log(res);
      var org = {
        index: res._index,
        type: res._type,
        id: res._id
      }
      es.read(org, function(res2){
        t.ok(res._version > 0, "✓ ORG Record created: " + res._id);
        t.ok(res._type === 'org', "✓ ORG Record type is: " + res._type);
        t.ok(res2._source.pcount > 10, "✓ ORG has: " + res2._source.pcount +" people")
        t.end();
      })
    })
  })
});
