var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test('RECORDER save List of ISSUEs to Repo Record', function(t) {
  var url = '/dwyl/time/issues';
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_issues(data, function(res) {
      // console.log(res);
      var repo = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(repo, function(res2) {
        // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
        // console.log(res2._source.issues);
        var count = res2._source.issues.length
        t.ok(count > 1, "✓ "+url +" has " +count + " issues!" )
        t.end();
      }) // end read
    }) // end add_issues
  }) // end scrape for followers list
}); // end test

test('RECORDER save SECOND PAGE of ISSUEs to Repo Record', function(t) {
  var url = 'https://github.com/dwyl/time/issues?page=2';
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_issues(data, function(res) {
      gs(data.next_page, function(err2, data2){
        recorder(data2, function(res2){
          // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
          // console.log(res2);
          var repo = {
            id:    res2._id,
            index: res2._index,
            type:  res2._type
          }
          es.read(repo, function(res3) {
            // console.log(' - - - - - - - - - - - - - - - - - - - - - - res3:')
            // console.log(res3._source);
            var count = res3._source.issues.length
            t.ok(count > 1, "✓ "+ res3._source.url +" has " +count + " issues!" )
            t.end();
          }) // end read
        })
      })
    }) // end add_issues
  }) // end scrape for followers list
}); // end test
