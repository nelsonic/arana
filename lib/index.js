var gs = require('github-scraper');

gs('/iteles', function(err, data){
  console.log(err, data)
})
