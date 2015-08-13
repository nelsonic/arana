var worker = require('./lib/worker');
var wq     = require('./lib/work_queue');
var gs     = require('github-scraper')
var recorder = require('./lib/recorder');
var tasker = require('./lib/tasker')
var concurrency_level = 30
var task = '/alanshaw'+ " "+Date.now() + " " + Date.now()+1
var url = task.split(' ')[0];

// function boot(){
  setInterval(function() {
    // check how many workers are currently running
    wq.count('in-progress', function(err2, count) {
      // console.log(count);
      // if the in-progress count is less than concurrency_level spawn
      if(count < concurrency_level){
        // for(var i = concurrency_level - count; i >= 0; i--){
          worker(function(res){
            // console.log(res)
            // console.log(" - - - - - - - - end - - - - - - - ");
          });
        // }
      }
    })
  },50);
// }
/*
wq.add(url, function(err, data) { // initial task

  gs(url, function(err, data){
    recorder(data, function(res){
      console.log(res);
      var tasks = tasker(data);
      console.log("Tasks:",tasks);
      var count = tasks.length
      tasks.map(function(t){
        wq.add(t, function(e, d){
          // console.log(e, d);
        })
      });

      wq.finish(task, function(err2, data2){
        console.log(err2, data2);
        boot();
      })
    });
    // return true;
  })
})
*/
