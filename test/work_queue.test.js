var test = require('tape');
var wq = require('../lib/work_queue');

test('Add an item to the work queue', function(t){
  var task = '/iteles '+ Date.now();
  wq.add(task, function(err, data) {
    t.ok(data > 0, '✓ Task was added at a index: ' + data)
  })
  wq.add(task, function(err, data) {
    t.ok(data > 0, '✓ Task was added at a index: ' + data)
    t.end();
  })
});

test('Fetch the next task from the work queue', function(t){
  wq.next(function(err, data) {
    t.ok(err === null, "no error retrieving task from work queue")
    t.ok(data.indexOf('/') > -1, '✓ Next task is: ' + data)
    t.end()
  })
});

test('Close redis connection', function(t){
  wq.redisClient.end();
  t.ok(wq.redisClient.connected === false, "✓ Still Connected to Redis? "+wq.redisClient.connected);
  t.end();

})
