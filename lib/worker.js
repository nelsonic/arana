var wq = require('./work_queue');
var gs = require('github-scraper');
var tasker = require('./tasker')
var aguid  = require('aguid');
var recorder = require('./recorder');
/**
 *
 */
module.exports = function run (callback) {
  // fetch the next task from the work queue
  wq.next(function(err, task) {
    // console.log(task);
    gs(task.split(' ')[0], function(gserr, data){
      if(gserr){
        wq.finish(task, function(err2, data2){
          // console.log(err2, data2);
          return callback(err);
        })
      }
      else {
        var finished = Date.now(); // time scraping finished
        var started = task.split(' ')[1];
        var took  = finished - started;
        var entry = task + " " +finished + " " + took
        var tasks = tasker(data); // get list of next tasks
        // console.log("Tasks >> ",tasks);
        recorder(data, function(res){
          // console.log(res);
          var count = tasks.length
          tasks.forEach(function(t){
            wq.add(t, function(e, d){
              // console.log(e, d);
            })
          });
          wq.finish(task, function(err2, data2){
            // console.log(err2, data2);
            return callback(data);
          })
        });
      }
    })
  })
}

module.exports.redisClient = wq.redisClient;
// function
