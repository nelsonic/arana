var es    = require('esta');
var aguid = require('aguid');

/**
 * recorder is a general purpose record saver
 */
module.exports = function save_record_to_elasticsearch (data, callback) {
  console.log(data);
  data.id    = aguid(data.url)
  data.index = 'github'
  data.type  = determine_record_type(data);

  if(data.url.match(/\\/followers/))

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

// if the url is /followers we add that list of entries to the
// person's followers object on their profile
function add_followers(data) {
  var username = data.url.substr(data.url.lastIndexOf('/') + 1);
  console.log(username)
}
// if follower is not already a key in followers Object
// we add it with a value of today's timestamp
