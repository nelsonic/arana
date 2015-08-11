// After all the other tests have run we need to clear state on DEV for next time
var test  = require('tape');
var chalk = require('chalk');
// var redis       = require('redis');
// var rc          = require('../lib/redis_config.js')(process.env.NODE_ENV); // config for Cloud/Local
// var redisClient = redis.createClient(rc.port, rc.host); // create client
// redisClient.auth(rc.auth); // *optionally* authenticate when using RedisCloud
var wq = require('../lib/work_queue');
var DROP  = require('./y_drop_it_like_its_hot.js');
var STATS = require('../node_modules/esta/lib/stats.js');
var record = { // fake record
  type: 'tweet',
  index: 'twitter',
  id: 1
}

test( chalk.yellow.bgRed.bold(' - DROP ALL INDEXes so ES is Clean for Next Time - '), function (t) {
  DROP(record, function (res) {
    STATS(function (res) {
      t.deepEqual(res._all.primaries, {}, chalk.green.bold("✓ ALL ES Indexes DELETED - Tests Pass. What's NEXT?"));
      t.end();
    });
  });
});

test( chalk.yellow.bgRed.bold(' - FLUSHDB  so REDIS is Clean for Next Time - '), function (t) {
  wq.redisClient.FLUSHDB()
      // t.deepEqual(res._all.primaries, {}, chalk.green.bold("✓ ALL ES Indexes DELETED - Tests Pass. What's NEXT?"));
  // wq.next(function(err, task){
    // console.log(err, task)
    // t.ok(task === 'undefined undefined', "✓ no tasks in redis! (as expected)");
    // wq.redisClient.FLUSHDB() // flush it again because wq.next creates an entry in-progess
    wq.redisClient.end();
    var connected = wq.redisClient.connected
    t.ok(connected === false, "✓ Connected to Redis? "+connected +" (as expected)");
    t.end();
  // })

});

// Should we delete all keys in Redis? FLUSHDB
// https://github.com/NodeRedis/node_redis/blob/6cae0b880fcecd45dab79a5f66d576b7bc86a570/test/test.js#L196
