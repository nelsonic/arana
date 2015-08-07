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
  console.log(task);
  redisClient.rpush("work-queue", task, function (err, data) {
    console.log(data);
    callback(err, data)
  });
}

module.exports = {
  add: add,
  redisClient: redisClient
};
