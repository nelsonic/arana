var wq = require('./work_queue');
var gs = require('github-scraper');
var tasker = require('./tasker')
var aguid  = require('aguid');
var recorder = require('./recorder');
/**
 *
 */
module.exports = function run () {
  // fetch the next task from the work queue
  wq.next(function(err, task) {
    console.log(task);
    gs(task.split(' ')[0], function(err, data){
      recorder(data, function(res){
        
      });
      var tasks = tasker(data);
      console.log(tasks);
      var count = tasks.length
      if(count > 0) {
        for(i = tasks.length; i > 0; i--){
          wq.add(tasks[i], function(e, d){

            if(i === 1) {
              console.log("done! " + d);
              return true;
            }
          })
        }
      }
      else {

        run();
      }

      // return true;
    })
  })
}

// function
