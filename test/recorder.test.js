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
        t.ok(res2.found, "✓ Record Found: " +res2._id);
        // console.log(res2);
        t.end();
      })

    })
  })
});

test('Add followers crawled BEFORE Profile Record exists', function(t) {
  var url = 'jupiter/followers';
  gs(url, function(err, data) {
    // at this point the data.entries only has @iteles *real* followers
    // so we'er going to creat a fictional *new* follower to test
    var fictional_follower = 'EverythingIsAwesome' + Math.floor(Math.random()*100000000000);
    // console.log(fictional_follower);
    data.entries.push(fictional_follower);
    recorder.add_followers(data, function(res) {
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2){
        var followers = Object.keys(res2._source.followers);
        console.log(url + " >> " + followers.join(', '));
        t.ok(followers.indexOf(fictional_follower) > -1, "✓ Follower added: " + fictional_follower)
        t.end();
      }) // end read
    }) // end add_followers
  }) // end scrape for followers list
}); // end test

test('Add list of followers to Profile Record', function(t) {
  var url = 'iteles/followers';
  gs(url, function(err, data) {
    // at this point the data.entries only has @iteles *real* followers
    // so we'er going to creat a fictional *new* follower to test
    var fictional_follower = 'EverythingIsAwesome' + Math.floor(Math.random()*100000000000);
    // console.log(fictional_follower);
    data.entries.push(fictional_follower);
    recorder.add_followers(data, function(res) {
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2){
        // console.log(res2);
        var followers = Object.keys(res2._source.followers);
        t.ok(followers.indexOf(fictional_follower) > -1, "✓ Follower added: " + fictional_follower)
        t.end();
      }) // end read
    }) // end add_followers
  }) // end scrape for followers list
}); // end test

test('Add list followers to Profile with EXISTING Followers object', function(t) {
  var url = 'iteles/followers';
  gs(url, function(err, data) {
    // at this point the data.entries only has @iteles *real* followers
    // so we'er going to creat a fictional *new* follower to test
    var fictional_follower = 'EverythingIsAwesome' + Math.floor(Math.random()*100000000000);
    // console.log(fictional_follower);
    data.entries.push(fictional_follower);
    recorder(data, function(res) {
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2){
        // console.log(res2);
        var followers = Object.keys(res2._source.followers);
        t.ok(followers.indexOf(fictional_follower) > -1, "✓ Follower added: " + fictional_follower)
        t.end();
      }) // end read
    }) // end add_followers
  }) // end scrape for followers list
}); // end test

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
