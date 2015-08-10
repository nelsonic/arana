var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method


test('RECORDER save INDIVIDUAL ISSUE (save-all-the-things method!)', function(t) {
  var url = 'https://github.com/dwyl/learn-elasticsearch/issues/1';
  gs(url, function(err, data) {
    // console.log(data);
    var record_type = recorder.record_type(data);
    t.ok(record_type === 'issue', "✓ record type is: "+record_type)
    recorder(data, function(res) {
      // console.log(res);
      var repo = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(repo, function(res2) {
        // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
        // console.log(res2);
        var issue = res2._source.entries.filter(function(comment){
          return comment.id === 'issuecomment-61982021';
        })
        var comment = issue[0].body;
        t.ok(res2._source.url.indexOf(url) > -1, "✓ Issue URL: "+res2._source.url)
        t.ok(comment.match('reply from Peter'), "✓ Comment: "+comment)
        t.ok(res2._source.entries.length > 0, "✓ "+url +" has " +res2._source.entries.length + " comments" )
        t.end();
      }) // end read
    }) // end save_repo
  }) // end scrape for followers list
}); // end test
