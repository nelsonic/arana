var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test('RECORDER save List of LABELS to Repo Record', function(t) {
  var url = 'dwyl/image-uploads/labels';
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_labels(data, function(res) {
      // console.log(res);
      var repo = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(repo, function(res2) {
        console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
        console.log(res2._source);
        var count = res2._source.labels.length
        t.ok(count > 1, "✓ "+url +" has " +count + " labels!" )
        t.end();
      }) // end read
    }) // end add_issues
  }) // end scrape for followers list
}); // end test

test('RECORDER save Labels to record again (in-direct)', function(t) {
  var url = 'https://github.com/dwyl/image-uploads/labels';
  gs(url, function(err, data) {
    console.log(data);
    recorder(data, function(res2) {
      console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
      console.log(res2);
      var repo = {
        id:    res2._id,
        index: res2._index,
        type:  res2._type
      }
      es.read(repo, function(res3) {
        console.log(' - - - - - - - - - - - - - - - - - - - - - - res3:')
        console.log(res3._source);
        var count = res3._source.labels.length
        t.ok(count > 1, "✓ "+ res3._source.url +" has " +count + " labels" )
        t.end();
      }) // end read
    }) // end add_issues
  }) // end scrape for followers list
}); // end test
