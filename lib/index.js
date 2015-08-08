var gs     = require('github-scraper');
var es     = require('esta');
var aguid  = require('aguid');
var tasker = require('./tasker');

// gs('/nelsonic', function(err, data){
//   // console.log(err, data)
//   var tasks = tasker(data);
//   // console.log(tasks)
//   data.id    = aguid(data.url)
//   data.index = 'gh'
//   data.type  = 'p'
//   es.update(data, function(res){
//     console.log(res);
//     // var t = new Date(data.lastupdated)
//     // console.log(t)
//   })
//
// })

var worker = require('./worker');

worker();
