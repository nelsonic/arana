var es    = require('esta');
var aguid = require('aguid');
var url   = require('url');

function determine_record_type(data) {
  var type = 'person'; // person until proved otherwise

  return type;
}

// if the url is /followers we add that list of entries to the
// person's followers object on their profile
function add_people(data, method, callback) {
  var uri      = url.parse(data.url); // to extract username from scraped url
  var username = uri.path.split('/')[1];
  console.log("username: "+username);
  // fetch the profile record if it exists:
  // strip next page query params
  var profile_url  = uri.protocol +"//"+ uri.host + uri.pathname;
  data.url = profile_url.replace('/'+method, '');
  console.log("profile_url: "+profile_url);

  var profile = {
    id:    aguid(data.url),
    index: 'github',
    type:  'person'
  }
  es.read(profile, function(res){
    if(res.found) {
      if(res._source[method]) {
        var existing = Object.keys(res._source[method]).sort();
        data.entries.sort().map(function(f){
          if(existing.indexOf(f) === -1) { // f not currently in list of followers
            res._source[method][f] = Date.now(); // add as new follower
          }
          else {
            // console.log('Existing user: '+f + " > " + existing.indexOf(f))
          }
        });
        es.update(res._source, function(res2) {
          return callback(res2);
        });
      } else {
        res._source[method] = res._source[method] || {}; // empty if not exist
        console.log("NO *EXISTING* Followers")
        // res._source[method] = {}; // create the empty followers object
        data.entries.map(function(f) { // add the follower
          res._source[method][f] = Date.now(); // add as new follower
        });
        es.update(res._source, function(res2) {
          return callback(res2);
        });
      }

    }
    else { // no profile record found lets create one with just the followers
      console.log('NOT FOUND');
      data[method] = data[method] || {};
      data.entries.map(function(f) { // add the follower
        data[method][f] = Date.now(); // add as new follower
      })
      data.id    = profile.id;
      data.index = profile.index;
      data.type  = profile.type;
      delete data.entries;
      es.update(data, function(res2) {
        return callback(res2);
      });
    }
  })
}

/**
 * recorder is a general purpose record saver
 */
module.exports = function save_record_to_elasticsearch (data, callback) {
  console.log(" - - - - - - - - - - - - - - - URL:")
  console.log(data.url);
  // if the page scraped was a followers page
  if(data.url.match(/^https:\/\/github\.com\/[\w-]+\/followers/g)) {
    return add_people(data, 'followers', callback)
  }
  else {
    // console.log(data);
    data.id    = aguid(data.url)
    data.index = 'github'
    data.type  = determine_record_type(data);
    es.update(data, function(res) {
      return callback(res);
    })
  }

}


module.exports.record_type = determine_record_type; // exported for func test
module.exports.add_people  = add_people;            // exported for func test
// if follower is not already a key in followers Object
// we add it with a value of today's timestamp


// unfollowed
