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
        data.f = Date.now(); // time scraping finished
        data.s = task.split(' ')[1]; // start timestamp
        data.t  = data.f - data.s; // finish - start time
        // var entry = task + " " +finished + " " + took
        var tasks = tasker(data); // get list of next tasks
        tasks.forEach(function(t){
          wq.add(t, function(e, d){
            // console.log(e, d);
          })
        });
        // console.log("Tasks >> ",tasks);
        recorder(data, function(res){
          // console.log(res);
          wq.finish(task, function(err2, data2){
            // console.log(err2, data2);
            if(res.created){
              return callback(data)
            }
            else {
              return callback(res);
            }
          })
        });
      }
    })
  })
}

module.exports.redisClient = wq.redisClient;
// function
