// var wq = require('work-queue');
/**
 * tasker takes a record & creates more tasks - method is synchronous (but fast)
 * @param {Object} data - the scraped data from a GitHub page
 * @returns {Array} tasks - the list of newly created tasks
 */
 module.exports = function tasker (data) {
   var tasks = [], created = new Date().getTime(), username, org, repo, url;
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
     url = '/stars/'+username;
     tasks.push(url + ' ' + created);
   }
   // scrape each organisation listed on the person's profile:
   if(data.orgs && data.orgs.length > 0){
     data.orgs.map(function(org){
       url = org.split(' ')[0];
       tasks.push(url + ' ' + created);
     });
   }

   // next_page
   if(data.next_page){
     tasks.push(data.next_page + ' ' + created);
   }

   // add task to scrape each entry in repositories
   if(data.url.match(/tab=repositories/) && data.entries.length > 0) {
     data.entries.map(function(repo){
       tasks.push(repo.url + ' ' + created);
     })
   }
   // organisation repos:
   if(data.pcount) {
     org = data.url.substr(data.url.lastIndexOf('/') + 1);
     data.entries.map(function(repo){
       tasks.push(org + '/' + repo.name + ' ' + created);
     })
   }
   // if an organisation has people, add task to scrape their profiles
   if(data.pcount > 0){
     url = "/orgs/" + org + "/people";
     tasks.push(url + ' ' + created);
   }

  //  console.log(tasks);
   return tasks;

 }
