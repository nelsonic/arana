var test = require('tape');
var wq = require('../lib/work_queue');
var decache = require('decache');

test('Add an item to the work queue', function(t){
  var task = '/jim';
  wq.add(task, function(err, data) {
    t.ok(data >= 0, '✓ Task was added at a index: ' + data)
    setTimeout(function(){
      var task = '/alanshaw'
      wq.add(task, function(err, data) {
        t.ok(data >= 0, '✓ Task was added at a index: ' + data)
        t.end();
      })
    },10)
  })
});

test('Fetch the next task from the work queue', function(t){
  wq.next(function(err, data) {
    console.log(err, data)
    // console.log("Next Task: " +data);
    t.ok(err === null, "no error retrieving task from work queue")
    t.ok(data.indexOf('/jim') > -1, '✓ Next task is: ' + data)
    t.end()
  })
});

test('Close redis connection', function(t){
  wq.redisClient.end();
  var connected = wq.redisClient.connected
  t.ok(connected === false, "✓ Connected to Redis? "+connected +" (as expected)");
  decache('../lib/work_queue'); // delete from cache for taredown
  t.end();
})
