var dir      = __dirname.split('/')[__dirname.split('/').length-1];
var file     = dir + __filename.replace(__dirname, '') + " > ";
var test     = require('tape');
var url_transform = require('../lib/url_transform');
// Yes, I'm requiring a private method from my dependency. don't do this kids!
var url_validator = require('../node_modules/github-scraper/lib/url_validator')

test(file+'url_transform issue url to base repo', function(t) {
  var url = '/dwyl/tudo/issues?page=2&q=is%3Aissue+is%3Aopen'
  url = url_validator(url, function(){}); // ignore this empty function!
  var data = {url : url};
  data = url_transform(data);

  t.ok(data.url.indexOf('page=') === -1, "✓ "
  +url +" page= removed: "+data.url);
  t.ok(data.url === '/dwyl/tudo', "✓ url_transform: " +url +" >> "+data.url)
  t.end();
});

test(file+'url_transform else (no transform) branch test', function(t){
  var url = 'https://github.com/iteles'
  var data = {url:url}
  data = url_transform(data);
  t.ok(data.url === '/iteles', "✓ url_transform removes domain >> "+data.url)
  // console.log(url);
  t.end();
});

test(file+'url_transform followers to profile route', function(t){
  var url = 'https://github.com/iteles/followers'
  var data = {url:url}
  data = url_transform(data, 'followers');
  t.ok(data.url === '/iteles', "✓ url_transform: " +url +" >> "+data.url)
  // console.log(url);
  t.end();
});

test(file+'url_transform followers url to base (profile) path', function(t){
  var url = 'https://github.com/iteles/followers'
  var data = {url:url}
  data = url_transform(data, 'followers');
  t.ok(data.url === '/iteles', "✓ url_transform: " +url +" >> "+data.url)
  // console.log(url);
  t.end();
});

test(file+'url_transform following url to base (profile) path', function(t){
  var url = 'https://github.com/iteles/following'
  var data = {url:url}
  data = url_transform(data, 'following');
  t.ok(data.url === '/iteles', "✓ url_transform: " +url +" >> "+data.url)
  // console.log(url);
  t.end();
});

test(file+'url_transform strips labels from repo url', function(t){
  var url = 'https://github.com/dwyl/tudo/labels'
  var data = {url:url}
  data = url_transform(data);
  t.ok(data.url === '/dwyl/tudo', "✓ url_transform: " +url +" >> "+data.url)
  // console.log(url);
  t.end();
});

test(file+'url_transform strips milestones from repo url', function(t){
  var url = 'https://github.com/dwyl/tudo/milestones'
  var data = {url:url}
  data = url_transform(data);
  t.ok(data.url === '/dwyl/tudo', "✓ url_transform: " +url +" >> "+data.url)
  // console.log(url);
  t.end();
});
