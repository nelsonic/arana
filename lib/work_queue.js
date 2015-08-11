var aguid       = require('aguid');
var redis       = require('redis');
var rc          = require('../lib/redis_config.js')(process.env.NODE_ENV); // config for Cloud/Local
var redisClient = redis.createClient(rc.port, rc.host); // create client
redisClient.auth(rc.auth); // *optionally* authenticate when using RedisCloud

/**
 * add puts an item in the redis work queue
 * @param {String} task - a crawler task in the format {url} {timestamp}
 * @param {Function} callback - call this once redis responds
 */
function add (task, callback) {
  var args = ["work-queue", Date.now(), task]
  // console.log(args)
  redisClient.zadd(args, function (err, data) {
    callback(err, data)
  });
}

/**
 * next fetches the next task from the redis work queue
 * @param {Function} callback - call this once redis responds
 * see: http://stackoverflow.com/a/22052718/1148249
 */
function next (callback) {
  var args = [ "work-queue", '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 1 ];
  redisClient.zrevrangebyscore(args, function (err, data) {
    // var taskid = aguid(data.url);
    // console.log(err)
    console.log(data)
    var url = data[0]
    var created = data[1]
    var started = Date.now();   // when the worker first starte
    var task = url+" "+created; // url + timestamp (when task was created)
    var args = [ "in-progess", started, task ];
    console.log(args);
    redisClient.zadd(args, function(err2, data2){
      console.log(data2);
      callback(err2, task);
    })
  });
}

module.exports = {
  add: add,
  next: next,
  redisClient: redisClient // export the connection so we can close it in test!
};
