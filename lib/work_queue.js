var aguid       = require('aguid');
var redisClient = require('redis-connection')();
var DAY = 24 * 60 * 60 * 1000;

/**
 * count tells us the number of items in the zset
 * @param {String} queue the name of the queue e.g. work-queue or in-progress
 * @param {Function} callback - call this once redis responds
 * see: http://redis.io/commands/zcard
 */
function count (queue, callback) {
  redisClient.zcard(queue, function(err, data){
    // console.log(" - - - - -  count: "+queue)
    // console.log(err, data)
    return callback(err, data)
  });
}

/**
 * history tells us the "score" (timestamp) for the given url
 * @param {String} url the route we want to lookup
 * @param {Function} callback - call this once redis responds
 * see: http://redis.io/commands/zscore
 */
function history (url, callback) {
  console.log('\n- - - - - - - - - - - - - - - > HISTORY URL:' +url);
  redisClient.zscore('history', url, function(err, data){
    // console.log(" - - - - -  history: "+url)
    // console.log(err, data)
    return callback(err, data)
  });
}

/**
 * add puts an item in the redis work queue
 * @param {String} url - a url to be crawled
 * @param {Function} callback - call this once redis responds
 */
function add (url, callback) {
  url = url.replace('https://github.com', ''); // don't waste RAM!
  var now   = Date.now();
  var args = ["work-queue", now, url]
  // console.log(' - - - - - - - - - - - - - - URL: '+url)
  history(url, function(err, timestamp){

    var ts = parseInt(timestamp,10);
    // console.log(" - - - - - - - - - - - - - - - - - - - - - HISTORY timestamp: "+timestamp)
    console.log(ts +" + " + DAY + " > " + now);
    if(timestamp && (timestamp + DAY) > now) {
      args[1] = now + DAY; // only crawl tomorrow
    }
    console.log(args)
    redisClient.zadd(args, function (err, data) {
      callback(err, data)
    });
  })
  // console.log(args)
  // first check if the url exists in the history
}


/**
 * next fetches the next task from the redis work queue
 * also removes it from the work-queue and adds it to in-progress
 * @param {Function} callback - call this once redis responds
 * top "scoring" item in zset: http://stackoverflow.com/a/22052718/1148249
 */
function next (callback) {
  // var args = [ "work-queue", '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 1 ];
  var args = [ "work-queue", '-inf', '+inf', 'WITHSCORES', 'LIMIT', 0, 1 ];
  redisClient.zrangebyscore(args, function (err, data) {
    // console.log(data)
    var url = data[0]
    var created = data[1]
    var started = Date.now();   // when the worker first started the task
    // var task = url+" "+created; // url + timestamp (when task was created)
    // add the task to inprogress zset
    // var score = ""+created.toString() + " " +started
    // add task to in-progress  created    url
    var args = [ "in-progress", created, url ];
    redisClient.zadd(args, function(err2, data2){
      // console.log(err2, data2)
      // remove the task from the work-queue so its not done twice
      var remove = ["work-queue", url]; // http://redis.io/commands/zrem
      redisClient.zrem(remove, function(err3, data3){
        // console.log(err3, data3);
        callback(err2, url + " "+created + " "+started);
      })
    })
  });
}


/**
 * count tells us the number of items in the zset
 * @param {String} task the task currently being
 * @param {Function} callback - call this once redis responds
 */
function finish (task, callback) {
  var url = task.split(' ')[0];
  var started = task.split(' ')[2];
  var remove = ["in-progress", url]; // http://redis.io/commands/zrem
  // console.log(" - - - - - - - - - - - - - - - remove:")
  // console.log(remove);
  redisClient.zrem(remove, function(err, data) {
    // console.log(err, data);
    var finished = Date.now();
    var took  = finished - started;
    var entry = task + " " +finished + " " + took
    // only store the url as the key and finished time as score
    var history = ['history', Date.now(), url]

    redisClient.zadd(history, function(err2, data2) {
      // console.log(err2, data2);
      return callback(err2, data2);
    })
  })
}

module.exports = {
  add:         add,
  count:       count,
  finish:      finish,
  history:     history,
  next:        next,
  redisClient: redisClient // export the connection so we can close it in test!
};
