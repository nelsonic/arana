var es    = require('esta');
var aguid = require('aguid');
var url   = require('url');
var url_transform = require('./url_transform');

function determine_record_type(data) {
  var type = 'person'; // person until proved otherwise
  if(data.pcount) {
    type = 'org'
  }
  else if(data.stars) { // only repos have stars
    type = 'repo'
  }
  else if(data.state) { // only repos have stars
    type = 'issue'
  }
  return type;
}


// if the url is /followers we add that list of entries to the
// person's followers object on their profile
function add_people(data, method, callback) {
  data = url_transform(data, method);
  var record = {
    id:    aguid(data.url),
    index: 'github',
    type:  determine_record_type(data)
  }
  // fetch the profile/org record if it exists:
  es.read(record, function(res){
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
      data.id    = record.id;
      data.index = record.index;
      data.type  = record.type;
      delete data.entries;

      es.update(data, function(res2) {
        return callback(res2);
      });
    }
  })
}

function add_repos(data, callback){
  data = url_transform(data);
  var record = {
    id:    aguid(data.url),
    url:   data.url,
    index: 'github',
    type:  determine_record_type(data)
  }
  // fetch the profile/org record if it exists:
  es.read(record, function(res){
    if(res.found) {
      // console.log("Record: "+data.url+" FOUND!")
      res._source.repos = res._source.repos || []; // empty if not exist
      // console.log(" - - - - - - - - - - - - - - - repos:")
      // console.log(res._source);
      var existing_repos = res._source.repos.map(function(repo){
        return repo.name;
      })
      data.entries.map(function(repo) { // add the follower
        if(existing_repos.indexOf(repo.name) === -1){
          res._source.repos.push(repo);
        }
      });
      es.update(res._source, function(res2) {
        return callback(res2);
      });
    }
    else {
      // console.log("add_repos Record: "+data.url+" NOT FOUND!")
      record.repos = [];
      // copy all elements of data to record
      var keys = Object.keys(data);
      keys.map(function(k){
        record[k] = data[k];
      })
      delete record.entries; // entries become "repos" below
      data.entries.map(function(repo) { // add the follower
        record.repos.push(repo);
      });
      es.update(record, function(res2) {
        return callback(res2);
      });
    }
  });
}

/**
 * add list of issues to the repo record
 */
function add_issues(data, callback){
  // console.log('ISSUES URL: '+ data.url)
  data = url_transform(data); // url of the repo
  console.log('add_issues URL transformed to: ' + data.url + " > "+aguid(data.url));
  var record = {
    id:    aguid(data.url),
    url:   data.url,
    index: 'github',
    type:  'repo'
  }
  // fetch the profile/org record if it exists:
  es.read(record, function(res){
    if(res.found) {
      // console.log("Record: "+data.url+" FOUND!")
      res._source.issues = res._source.issues || []; // empty if not exist
      // console.log(" - - - - - - - - - - - - - - - issues:")
      // console.log(res._source);
      var existing_issues = res._source.issues.map(function(issue){
        return issue.url;
      })
      data.entries.map(function(issue) { // add the follower
        if(existing_issues.indexOf(issue.url) === -1){
          res._source.issues.push(issue);
        }
      });
      delete data.entries; // we've already saved these
      var issues_keys = Object.keys(data);
      issues_keys.map(function(k) { // transfer all meta-data to repo record
        res._source[k] = data[k];   // adds number of open & closed issues
      })                            // which is useful info to have ;-)
      es.update(res._source, function(res2) {
        return callback(res2);
      });
    }
    else {
      console.log("add_issues Record: "+data.url+" NOT FOUND!")
      // console.log(data)
      // console.log(" - - - - - - - - - - - - - - - - - - - - - - ")
      record.issues = [];
      data.entries.map(function(issue) { // add the follower
        record.issues.push(issue);
      });
      delete record.entries;        // entries become "issues" below
      var keys = Object.keys(data);
      keys.map(function(k){
        record[k] = data[k];        // copy all elements of data to record
      })
      es.update(record, function(res2) {
        return callback(res2);
      });
    }
  });
}

/**
 * add list of Labels to the repo record
 */
function add_labels(data, callback){
  // console.log('ISSUES URL: '+ data.url)
  data = url_transform(data); // url of the repo
  // console.log('URL transformed to:' + data.url);
  var record = {
    id:    aguid(data.url),
    url:   data.url,
    index: 'github',
    type:  'repo'
  }
  // fetch the profile/org record if it exists:
  es.read(record, function(res){
    if(res.found) {
      // console.log("Record: "+data.url+" FOUND!", res)
      record = res._source;         // copy all fields of existing record
    }
    else {
      // console.log("Record: "+data.url+" NOT FOUND!")
    }
    record.labels = [];  // always overwrite
    data.entries.forEach(function(e){ record.labels.push(e) })
    es.update(record, function(res2) {
      return callback(res2);
    });
  });
}


/**
 * add list of Milestones to the repo record
 */
function add_milestones(data, callback){
  // console.log('ISSUES URL: '+ data.url)
  data = url_transform(data); // url of the repo
  // console.log('URL transformed to:' + data.url);
  var record = {
    id:    aguid(data.url),
    url:   data.url,
    index: 'github',
    type:  'repo'
  }
  // fetch the profile/org record if it exists:
  es.read(record, function(res){
    if(res.found) {
      // console.log("Record: "+data.url+" FOUND!", res)
      record = res._source;         // copy all fields of existing record
    }
    else {
      // console.log("Record: "+data.url+" NOT FOUND!", res)
    }
    record.milestones = [];  // always overwrite
    data.entries.forEach(function(e){ record.milestones.push(e) })
    es.update(record, function(res2) {
      return callback(res2);
    });
  });
}

/**
 * recorder is a general purpose record saver
 */
module.exports = function save_record_to_elasticsearch (data, callback) {
  // console.log(" - - - - - - - - - - - - - - - URL:")
  // console.log(data.url);
  // if the page scraped was a followers page

  if(data.url.match(/^https:\/\/github\.com\/[\w-]+\/followers/g)) {
    return add_people(data, 'followers', callback)
  } // see: https://github.com/nelsonic/arana/issues/4
  else if(data.url.match(/^https:\/\/github\.com\/[\w-]+\/following/g)) {
    return add_people(data, 'following', callback)
  }
  else if(data.url.match(/tab=repositories/)){
    return add_repos(data, callback);
  } //
  else if(data.pcount) {
    return add_repos(data, callback);
  }
  else if(data.url.match('/issues') && data.open) { // matches issues listing
    return add_issues(data, callback);
  }
  else if(data.url.match('/labels')) { // matches issues listing
    return add_labels(data, callback);
  }
  else if(data.url.match('/milestones')) {
    return add_milestones(data, callback);
  }
  else {
    // console.log(data);
    data = url_transform(data); // strip domain to save memory
    data.id    = aguid(data.url)
    data.index = 'github'
    data.type  = determine_record_type(data);
    // console.log(" - - - - >> Saving Data:")
    // console.log(data);

    es.update(data, function(res) {
      return callback(res);
    })
  }

}


module.exports.record_type    = determine_record_type; // exported for func test
module.exports.add_people     = add_people;            // exported for func test
module.exports.add_repos      = add_repos;             // exported for func test
// module.exports.url_transform  = url_transform          // exported for func test
module.exports.add_issues     = add_issues;            // exported for func test
module.exports.add_labels     = add_labels;            // exported for func test
module.exports.add_milestones = add_milestones;        // exported for func test

// if follower is not already a key in followers Object
// we add it with a value of today's timestamp

// unfollowed
