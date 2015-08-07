// var wq = require('work-queue');
/**
 * tasker takes a record & creates more tasks - method is synchronous (but fast)
 * @param {Object} data - the scraped data from a GitHub page
 * @returns {Array} tasks - the list of newly created tasks
 */
 module.exports = function tasker (data) {
   var tasks = [], created = new Date().getTime(), username, org, repo;
  //  console.log(data);

   // only scrape followers page if the person has non-zero followers:
   if(data.followercount > 0){
     tasks.push(data.url+'/followers' + ' ' + created);
   }
   if(data.followingcount > 0){
     tasks.push(data.url+'/following' + ' ' + created);
   }
   if(data.starred > 0){
     username = data.url.substr(data.url.lastIndexOf('/') + 1);
     var url = '/stars/'+username;
     tasks.push(url + ' ' + created);
   }
   // scrape each organisation listed on the person's profile:
   if(data.orgs && data.orgs.length > 0){
     data.orgs.map(function(org){
       var url = org.split(' ')[0];
       tasks.push(url + ' ' + created);
     });
   }

  //  console.log(tasks);
   return tasks;

 }
