var dir      = __dirname.split('/')[__dirname.split('/').length-1];
var file     = dir + __filename.replace(__dirname, '') + " > ";
var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

test(file+'Scrape Profile and Save Record in ElasticSearch', function(t) {
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

test(file+'RECORDER save list of FOLLOWING to Profile', function(t) {
  var url = '/pgte/following';
  gs(url, function(err, data) {
    recorder(data, function(res) {
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      // console.log("next_page:" + data.next_page);
      es.read(profile, function(res3){
        // console.log(' - - - - - - - - - - - - - - - - - - - - - - res3:')
        // console.log(res3);
        var following = Object.keys(res3._source.following);
        t.ok(following.length > 20, "✓ Following: " + following.length)
        t.end();
      }) // end read
    }) // end add_followers
  }) // end scrape for followers list
}); // end test

test(file+'RECORDER save ORG page data', function(t) {
  var url = 'dwyl';
  gs(url, function(err, data){
    t.ok(data.url === 'https://github.com/dwyl', "✓ Org scraped: "+url);
    // console.log(' - - - - - - - - - - - - - - - - - - - - - - data:')
    // console.log(data);
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

test(file+'RECORD repos to EXISTING Profile Record', function(t) {
  var url = 'iteles?tab=repositories';
  gs(url, function(err, data) {
    // console.log(data);
    recorder(data, function(res) {
      // console.log(res);
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2) {
      // console.log(" - - - - - - - - - - - - - - - res2:")
      // console.log(res2);
      var r = res2._source.repos.filter(function(repo){
        return repo.name === 'talks';
      })
      r = r[0];
      // console.log(r);
      t.ok(res2._source.url === '/iteles', "✓ Profile: "+res2._source.url)
      t.ok(r.stars > 0, "✓ "+url +" has " +res2._source.repos.length + " repos" )
      t.end();
      }) // end read
    }) // end add_repos
  }) // end scrape for followers list
}); // end test

test(file+'RECORD save REPO', function(t) {
  var url = 'dwyl/tudo';
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
        t.ok(res2._source.url.indexOf(url) > -1, "✓ Repo URL: "+res2._source.url)
        t.ok(res2._source.stars > 0, "✓ "+url +" has " +res2._source.stars + " stars" )
        t.end();
      }) // end read
    }) // end add_repos
  }) // end scrape for followers list
}); // end test

test(file+'RECORDER save (LIST OF) ISSUEs to REPO', function(t) {
  var url = 'dwyl/start-here';

  gs(url, function(err, data) {
    // console.log(data);
    recorder(data, function(res) {
      // console.log(' - - - - - - - - - - - - - - - - - - - - - - res:')
      // console.log(res);
      t.ok(res._type === 'repo', "✓ " +url +" is: " + res._id)
      url = 'dwyl/start-here/issues';
      gs(url, function(err2, data2){
        recorder(data2, function(res2){
          // console.log(' - - - - - - - - - - - - - - - - - - - - - - res2:')
          // console.log(res2);
          var repo = {
            id:    res._id,
            index: res._index,
            type:  res._type
          }
          es.read(repo, function(res3) {
            // console.log(' - - - - - - - - - - - - - - - - - - - - - - res3:')
            // console.log(res3);
            t.ok(res3._source.issues.length > 0, "✓ Issue count: "+res3._source.issues.length)
            t.ok(res3._source.closed > 9, "✓ "+url +" has " +res3._source.closed + " issues" )
            t.end();
          }) // end read
        });
      })
    })
  }) // end scrape for followers list
}); // end test

test(file+'RECORDER save INDIVIDUAL ISSUE (save-all-the-things method!)', function(t) {
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
        t.ok(res2._source.url === '/dwyl/learn-elasticsearch', "✓ Issue URL: "+res2._source.url)
        t.ok(comment.match('reply from Peter'), "✓ Comment: "+comment)
        t.ok(res2._source.entries.length > 0, "✓ "+url +" has " +res2._source.entries.length + " comments" )
        t.end();
      }) // end read
    }) // end save_repo
  }) // end scrape for followers list
}); // end test
