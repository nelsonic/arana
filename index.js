var worker = require('./lib/worker');
var wq     = require('./lib/work_queue');

wq.add('/nelsonic', function(err, data) { // initial task
  worker(function(res){
    console.log(res)
    console.log(" - - - - - - - - end - - - - - - - ");
  });
})
