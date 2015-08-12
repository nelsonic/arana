var dir      = __dirname.split('/')[__dirname.split('/').length-1];
var file     = dir + __filename.replace(__dirname, '') + " > ";
var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test(file+'RECORDER save repository (save-all-the-things method!)', function(t) {
  var url = 'nelsonic/practical-js-tdd';
  gs(url, function(err, data) {
    // console.log(data);
    recorder(data, function(res) {
      // console.log(res);
      var repo = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(repo, function(res2) {
        console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
        console.log(res2);
        t.ok(res2._source.url.indexOf(url) > -1, "✓ Repo URL: "+res2._source.url)
        t.ok(res2._source.stars > 0, "✓ "+url +" has " +res2._source.stars + " stars" )
        t.end();
      }) // end read
    }) // end save_repo
  }) // end scrape for followers list
}); // end test
