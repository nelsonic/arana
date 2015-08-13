var url   = require('url');
/**
 * url_transform converts any url into its "base url"
 * for example https://github.com/dwyl/tudo/issues becomes /dwyl/tudo
 * so that we can store the issues (list) in the repo record
 * @param {Object} data object returned from scraping the page
 * @param {String} method is the method we are scraping
 *  e.g: 'following', 'followers'
 * @return {Object} returns the data object with transformed url value
 */
module.exports = function url_transform(data, method) {
  // console.log("Transforming >> " +data.url)
  var uri = url.parse(data.url);
  if(uri.path.match(/tab=repositories/)) { // personal repositories
    var username = uri.path.replace('?tab=repositories','');
    // data.url = uri.protocol +"//"+ uri.host + username;
    data.url = username;
  }
  else if(uri.path.match(/orgs/)) {
    var org = uri.path.split('/')[1];
    // data.url = uri.protocol +"//"+ uri.host +'/' + org;
    data.url = '/' + org;
  }
  else if(method === 'following' || method === 'followers'){
    // var profile_url  = uri.protocol +"//"+ uri.host + uri.pathname;
    // data.url = profile_url.replace('/'+method, '');
    data.url = uri.pathname.replace('/'+method, '');
  }
  else if(uri.path.match('/issues')) {
    data.url = uri.path.slice(0, uri.path.indexOf('/issues'))
    // data.url = uri.protocol +"//"+ uri.host + data.url; // add back domain!
  }
  else if(uri.path.match('/labels')) {
    data.url = uri.path.slice(0, uri.path.indexOf('/labels'))
    // data.url = uri.protocol +"//"+ uri.host + data.url; // add back domain!
  }
  else if(uri.path.match('/milestones')) {
    data.url = uri.path.slice(0, uri.path.indexOf('/milestones'))
    // data.url = uri.protocol +"//"+ uri.host + data.url; // add back domain!
  }
  else {
    // data.url =  uri.protocol +"//"+ uri.host + uri.pathname
    data.url = uri.pathname;
  }
  if(data.url.indexOf('undefined') > -1){
    data.url = '/tj/followers'; // a good place to look for people ...
  }

  return data;
}
