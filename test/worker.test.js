// var worker = require('../lib/worker');
// var wq     = require('../lib/work_queue');
// var test   = require('tape');
//
// test("Simulate Error by adding task far in the past and scraping", function(t){
//   var task = 'ladieswhocode/london-tech-event-hack-collection/issues';
//   var day = 24 * 60 * 60 * 1000
//   var yesterday = Date.now() - day;
//   console.log(new Date(yesterday));
//   var args = ["work-queue", yesterday, task]
//   console.log(args)
//   worker.redisClient.zadd(args, function (err, data) {
//     // console.log(err, data)
//     worker(function(res) {
//       // console.log(res)
//       t.ok(res === 302, "✓ Handled error for REPO WITHOUT Issues: "+res)
//       t.end();
//     });
//   });
// })
//
// test("worker scrapes page and adds task to work queue", function(t) {
//   var task = '/iteles';
//   wq.add(task, function(err, data){
//     worker(function(res){
//       console.log(res)
//       console.log(" - - - - - - - - end - - - - - - - ");
//       t.ok(res.created === true, "✓ Record created: "+res._id)
//       worker.redisClient.end();
//       t.end();
//     });
//   })
// })
