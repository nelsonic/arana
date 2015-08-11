var test = require('tape');
var wq = require('../lib/work_queue');
var decache = require('decache');

test('Add (3) items to the work queue (we need these for later)', function(t){
  var task = '/jim';
  wq.add(task, function(err, data) {
    t.ok(data >= 0, '✓ Task ' +task +' was added at a index: ' + data)
    setTimeout(function() { // so the created timestamp is later
      var task = '/spock'
      wq.add(task, function(err, data) {
        t.ok(data >= 0, '✓ Task ' +task +' was added at a index: ' + data)
        setTimeout(function() {
          var task = '/sulu'
          wq.add(task, function(err, data) {
            t.ok(data >= 0, '✓ Task ' +task +' was added at a index: ' + data)
            t.end();
          })
        },10)
      })
    },10)
  })
});

test('There should be 3 tasks in the work-queue right now',function(t){
  var q = 'work-queue'
  wq.count(q, function(err, data){
    // console.log(data)
    t.ok(parseInt(data,10) === 3, "✓ there are "+data +" tasks in the "+q)
    t.end();
  })
})

test('Fetch the next task from the work queue', function(t){
  wq.next(function(err, data) {
    // console.log(err, data)
    // console.log("Next Task: " +data);
    t.ok(err === null, "no error retrieving task from work queue")
    t.ok(data.indexOf('/jim') > -1, '✓ Next task is: ' + data)
    t.end()
  })
});

test('There should be 2 tasks in the in-progress queue)',function(t){

  wq.next(function(err, data) {
    t.ok(data.indexOf('/spock') > -1, '✓ Next task is: ' + data)

    var q = 'in-progress'
    wq.count(q, function(err, data){
      // console.log(" - - - - - - - - - - - - - - - res2:")
      // console.log(data);
      t.ok(parseInt(data,10) === 2, "✓ there are "+data +" tasks in the "+q)
      t.end();
    })
    // console.log(err, data)
    // console.log("Next Task: " +data);
  })
})


test('Finish task (remove from "in-progress" and add to history)', function(t){
  wq.next(function(err, task) {
    console.log(err, task)
    t.ok(err === null, "no error retrieving task from work queue")
    console.log("Next Task: " +task);
    t.ok(task.indexOf('/sulu') > -1, '✓ Next task is: ' + task)
    // var url = task.split(' ')[0];
    wq.finish(task, function(err2, data2){
      console.log(err2, data2)
      t.end()
    })
  })
});

test('Close redis connection', function(t){
  wq.redisClient.end();
  var connected = wq.redisClient.connected
  t.ok(connected === false, "✓ Connected to Redis? "+connected +" (as expected)");
  decache('../lib/work_queue'); // delete from cache for taredown
  t.end();
})
