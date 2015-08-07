var test  = require('tape');
var ES    = require('esta');

test('CONNECT to ElasticSearch on Localhost', function (t) {
  // console.log('process.env.SEARCHBOX_SSL_URL: '+process.env.SEARCHBOX_SSL_URL)
  ES.CONNECT('twitter', function (res) {
    console.log(' - - - - - - - - - - - - - HEROKU ES response:')
    console.log(res);
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - \n')
    t.equal(res.status, 200, "✓ Status 200 - OK");
    t.end();
  });
});
