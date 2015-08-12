var dir      = __dirname.split('/')[__dirname.split('/').length-1];
var file     = dir + __filename.replace(__dirname, '') + " > ";
var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test(file+'RECORDER save List of MILESTONES to Repo Record', function(t) {
  var url = 'https://github.com/dwyl/tudo/milestones';
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_milestones(data, function(res) {
      // console.log(res);
      var repo = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(repo, function(res2) {
        // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
        // console.log(res2._source);
        var count = res2._source.milestones.length
        t.ok(count > 1, "✓ "+url +" has " +count + " milestones!" )
        t.end();
      }) // end read
    }) // end add_issues
  }) // end scrape for followers list
}); // end test

test(file+'RECORDER save MILESTONES to record again (in-direct)', function(t) {
  var url = 'dwyl/tudo/milestones';
  gs(url, function(err, data) {
    // console.log(data);
    recorder(data, function(res2) {
      // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
      // console.log(res2);
      var repo = {
        id:    res2._id,
        index: res2._index,
        type:  res2._type
      }
      es.read(repo, function(res3) {
        console.log(' - - - - - - - - - - - - - - - - - - - - - - res3:')
        console.log(res3._source);
        var count = res3._source.milestones.length
        t.ok(count > 1, "✓ "+ res3._source.url +" has " +count + " milestones" )
        t.end();
      }) // end read
    }) // end add_issues
  }) // end scrape for followers list
}); // end test
