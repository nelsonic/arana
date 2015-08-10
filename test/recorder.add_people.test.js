var test     = require('tape');
var recorder = require('../lib/recorder');
var gs       = require('github-scraper');
var es       = require('esta');

// Functional test for recorder.add_people method

test('Add followers crawled BEFORE Profile Record exists', function(t) {
  var url = 'jupiter/followers';
  gs(url, function(err, data) {
    // at this point the data.entries only has @iteles *real* followers
    // so we'er going to creat a fictional *new* follower to test
    var fictional_follower = 'EverythingIsAwesome' + Math.floor(Math.random()*100000000000);
    // console.log(fictional_follower);
    data.entries.push(fictional_follower);
    recorder.add_people(data, 'followers', function(res) {
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2){
        var followers = Object.keys(res2._source.followers);
        // console.log(url + " >> " + followers.join(', '));
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
    recorder.add_people(data, 'followers', function(res) {
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


test('Add list of FOLLOWING to Profile Record', function(t) {
  var url = 'iteles/following';
  gs(url, function(err, data) {
    // at this point the data.entries only has @iteles *real* followers
    // so we'er going to creat a fictional *new* follower to test
    var fictional_following = 'EverythingIsAwesome' + Math.floor(Math.random()*100000000000);
    // console.log(fictional_follower);
    data.entries.push(fictional_following);
    recorder.add_people(data, 'following', function(res) {
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      es.read(profile, function(res2){
        // console.log(res2);
        var followers = Object.keys(res2._source.following);
        t.ok(followers.indexOf(fictional_following) > -1, "✓ Following added: " + fictional_following)
        t.end();
      }) // end read
    }) // end add_followers
  }) // end scrape for followers list
}); // end test

test('Add MULTI-PAGE list of FOLLOWING to Profile', function(t) {
  var url = '/Marak/following';
  gs(url, function(err, data) {
    recorder.add_people(data, 'following', function(res) {
      // console.log(res);
      var profile = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      // console.log("next_page:" + data.next_page);
      gs(data.next_page, function(err2, data2) {
        recorder.add_people(data2, 'following', function(res2) {
          es.read(profile, function(res3){
            // console.log(' - - - - - - - - - - - - - - - - - - - - - - res3:')
            // console.log(res3);
            var following = Object.keys(res3._source.following);
            t.ok(following.length > 51, "✓ Following: " + following.length)
            t.end();
          }) // end read
        })
      })
    }) // end add_followers
  }) // end scrape for followers list
}); // end test

test('Add MULTI-PAGE list of ORG PEOPLE to ORG Record', function(t) {
  var url = 'orgs/github/people';
  // console.log(url)
  gs(url, function(err, data) {
    // console.log(data);
    recorder.add_people(data, 'people', function(res) {

      // console.log(res);
      var org = {
        id:    res._id,
        index: res._index,
        type:  res._type
      }
      // console.log("next_page:" + data.next_page);
      // setTimeout(function(){
        gs(data.next_page, function(err2, data2) {
          recorder.add_people(data2, 'people', function(res2) {
            es.read(org, function(res3){
              var people = Object.keys(res3._source.people);
              t.ok(people.length > 20, "✓ ORG People: " + people.length)
              t.end();
            }) // end read
          })
        })
      // },1000)
    }) // end add_followers
  }) // end scrape for followers list
}); // end test
