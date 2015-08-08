var es    = require('esta');
var aguid = require('aguid');
var url   = require('url');

/**
 * recorder is a general purpose record saver
 */
module.exports = function save_record_to_elasticsearch (data, callback) {
  // console.log(data);
  data.id    = aguid(data.url)
  data.index = 'github'
  data.type  = determine_record_type(data);

  if(data.url.match(/followers/)) {

  }

  es.update(data, function(res){
    console.log(res);
    // var t = new Date(data.lastupdated)
    // console.log(t)
    callback(res);
  })

}


function determine_record_type(data) {
  var type = 'person'; // person until proved otherwise

  return type;
}
module.exports.record_type = determine_record_type; // exported for func test

// if the url is /followers we add that list of entries to the
// person's followers object on their profile
function add_followers(data, callback) {
  var uri      = url.parse(data.url); // to extract username from scraped url
  var username = uri.path.split('/')[1];
  // fetch the profile record if it exists:
  var profile_url  = data.url.replace('/followers', '');
  var profile = {
    id:    aguid(profile_url),
    index: 'github',
    type:  'person'
  }
  console.log(username);
  es.read(profile, function(res){
    if(res.found) {
      console.log('FOUND!');
      if(res._source.followers){
        var existing = Object.keys(res._source.followers)
        console.log(">> HAS Followers: "+existing.join(', '))
        data.entries.map(function(f){
          if(existing.indexOf(f) === -1) { // f not currently in list of followers
            res._source.followers[f] = Date.now(); // add as new follower
          }
        });
      } else {
        console.log("NO *EXISTING* Followers")
        res._source.followers = {}; // create the empty followers object
        data.entries.map(function(f) { // add the follower
          res._source.followers[f] = Date.now(); // add as new follower
        })
      }
      es.update(res._source, function(res2){
        return callback(res2);
      })
    }
    else { // no profile record found lets create one with just the followers
      console.log('NOT FOUND');
      profile.followers = {};
      data.entries.map(function(f) { // add the follower
        profile.followers[f] = Date.now(); // add as new follower
      })
      es.update(profile, function(res2){
        return callback(res2);
      })
    }
  })
}
module.exports.add_followers = add_followers; // exported for func test
// if follower is not already a key in followers Object
// we add it with a value of today's timestamp


// unfollowed
