var envfile = require('path').resolve(__dirname + '../../env.json');
console.log(envfile);
var env = require('env2')(envfile)

// your app goes here
console.log(process.env.DB_HOST); // "127.0.0.1"
