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
    console.log(task);
    gs(task.split(' ')[0], function(err, data){
      recorder(data, function(res){
        console.log(res);
        var tasks = tasker(data);
        console.log(tasks);
        var count = tasks.length
        tasks.map(function(task){
          wq.add(task, function(e, d){
            console.log(e, d);
          })
        });
        return callback(res);
      });
      // return true;
    })
  })
}

module.exports.redisClient = wq.redisClient;
// function
