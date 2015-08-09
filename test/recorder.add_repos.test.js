var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test('Add repos crawled BEFORE Profile Record exists', function(t) {
  var url = 'rjmk?tab=repositories';
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_repos(data, function(res) {
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
        return repo.name === 'stopwatch';
      })
      r = r[0];
      // console.log(r);
      t.ok(res2._source.url === 'https://github.com/rjmk', "✓ Profile: "+res2._source.url)
      t.ok(r.stars > 0, "✓ "+url +" has " +res2._source.repos.length + " repos" )
      t.end();
      }) // end read
    }) // end add_repos
  }) // end scrape for followers list
}); // end test


test('Add repos to EXISTING Profile Record (created in add_people test)', function(t) {
  var url = 'iteles?tab=repositories';
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_repos(data, function(res) {
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
      t.ok(res2._source.url === 'https://github.com/iteles', "✓ Profile: "+res2._source.url)
      t.ok(r.stars > 0, "✓ "+url +" has " +res2._source.repos.length + " repos" )
      t.end();
      }) // end read
    }) // end add_repos
  }) // end scrape for followers list
}); // end test


test.only('Add SECOND PAGE of REPOS to EXISTING ORG Record', function(t) {
  var url = 'dwyl';
  gs(url, function(err, data) { // initial page of repos
    console.log(data.next_page);
    recorder.add_repos(data, function(res) {
      console.log(res);
      gs(data.next_page, function(err2, data2){ // second page of repos
        recorder.add_repos(data2, function(res2){
          console.log(res2);
          var org = {
            id:    res._id,
            index: res._index,
            type:  res._type
          }
          es.read(org, function(res3) {
            console.log(" - - - - - - - - - - - - - - - res3:")
            console.log(res3._source.repos.length);
            var r = res3._source.repos.filter(function(repo){
              return repo.name === 'retriever';
            })
            r = r[0];
            console.log(r);
            t.ok(res3._source.repos.length > 20, "✓  "+url + "(org) has multiple pages of repos!")
            t.ok(res3._source.url === 'https://github.com/dwyl', "✓ Record url: "+res3._source.url)
            t.ok(r.stars > 0, "✓ "+url +" has repo called " +r.name + " (as expected)" )
            t.end();
          })  // end es.read
        }) // end SECOND recoder.add_repos
      }) // end SECOND gs
    }) // end add_repos
  }) // end scrape for followers list
}); // end test
