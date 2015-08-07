var test = require('tape');
var wq = require('../lib/work_queue');
test('Add an item to the work queue', function(t){
  var task = '/url '+new Date().getTime();
  wq.add(task, function(err, data) {
    t.ok(data > 0, 'Task was added at a index: ' + data)
    console.log(' - - - - - - - - - - - - - - - ');
    // console.log(err, data);
    t.end();
    wq.redisClient.end();
  })
});
