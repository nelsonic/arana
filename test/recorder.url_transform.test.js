var test     = require('tape');
var recorder = require('../lib/recorder');
// Yes, I'm requiring a private method from my dependency. don't do this kids!
var url_validator = require('../node_modules/github-scraper/lib/url_validator')

test('recorder.url_transform issue urls', function(t) {
  var url = '/dwyl/tudo/issues?page=2&q=is%3Aissue+is%3Aopen'
  url = url_validator(url, function(){}); // ignore this empty function!
  var data = {url : url};
  var transformed_url = recorder.url_transform(data);
  t.ok(transformed_url.indexOf('page=') === -1, "✓ "
  +url +" transformed to: "+transformed_url);
  t.end();
});

test('recorder.url_transform else (no transform) branch test', function(t){
  var data = {url:'https://github.com/iteles'}
  var url = recorder.url_transform(data);
  t.ok(url === data.url, "✓ no transformation required")
  // console.log(url);
  t.end();
});
