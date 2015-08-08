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
  redisClient.rpush("work-queue", task, function (err, data) {
    callback(err, data)
  });
}

/**
 * next fetches the next task from the redis work queue
 * @param {Function} callback - call this once redis responds
 */
function next (callback) {
  redisClient.lpop("work-queue", function (err, data) {
    // var taskid = aguid(data.url);
    var info    = data.split(' ');
    var url     = info[0];
    var started = new Date().getTime();
    redisClient.HSET("in-progress", url, data +' ' +started, function(err2, data2){
      // console.log(data)
      callback(err, data)
    })
  });
}

module.exports = {
  add: add,
  next: next,
  redisClient: redisClient // export the connection so we can close it in test!
};
