var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test('Add followers crawled BEFORE Profile Record exists', function(t) {
  var url = 'iteles?tab=repositories';
  gs(url, function(err, data) {
    console.log(data);
    recorder.add_repos(data, function(res) {
      console.log(res);
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2) {
      console.log(" - - - - - - - - - - - - - - - res2:")
      // console.log(res2);
      var r = res2._source.repos.filter(function(repo){
        return repo.name === 'talks';
      })
      r = r[0];
      console.log(r);
      t.ok(res2._source.url === 'https://github.com/iteles', "✓ Profile: "+res2._source.url)
      t.ok(r.stars > 0, "✓ "+url +" has " +res2._source.repos.length + " repos" )
      t.end();
      }) // end read
    }) // end add_repos
  }) // end scrape for followers list
}); // end test
