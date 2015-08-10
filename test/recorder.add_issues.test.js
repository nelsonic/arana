var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test('recorder.url_transform issue urls', function(t) {
  var url = '/dwyl/tudo/issues?page=2&q=is%3Aissue+is%3Aopen'
  var data = {url : url};
  var transformed_url = recorder.url_transform(data);
  t.ok(transformed_url === '/dwyl/tudo', "✓ " +url +" transformed to: "+transformed_url);
  t.end();
});

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
        t.ok(res2._source.issues.length > 1, "✓ "+url +" has " +res2._source.issues.length + " issues!" )
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
      // console.log(res);
      var repo = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(repo, function(res2) {
        // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
        // console.log(res2._source.issues);
        t.ok(res2._source.issues.length > 1, "✓ "+url +" has " +res2._source.issues.length + " issues!" )
        t.end();
      }) // end read
    }) // end add_issues
  }) // end scrape for followers list
}); // end test
