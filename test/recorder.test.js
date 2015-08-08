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
        t.ok(res2.found, "Record Found")
        console.log(res2);
        t.end();
      })

    })
  })
});



test.only('Add list of followers to Profile Record', function(t) {
  var url = 'iteles/followers';
  gs(url, function(err, data) {
    // at this point the data.entries only has @iteles *real* followers
    // so we'er going to creat a fictional *new* follower to test
    var fictional_follower = 'EverythingIsAwesome' + Math.floor(Math.random()*100000000000);
    console.log(fictional_follower);
    // t.ok(data.url === 'https://github.com/iteles', "✓ Profile scraped: "+username);
    recorder.add_followers(data, function(res){
      // t.ok(res._version > 0, "✓ Record created: " + res._id);
      // t.ok(res._type === 'person', "✓ Record type is: " + res._type);
      console.log(res);
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
