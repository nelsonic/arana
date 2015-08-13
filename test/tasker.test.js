var dir      = __dirname.split('/')[__dirname.split('/').length-1];
var file     = dir + __filename.replace(__dirname, '') + " > ";
var test   = require('tape');
var tasker = require('../lib/tasker');
var gs     = require('github-scraper');

test(file+'TASKER no url set', function(t){
  var tasks = tasker({}); // empty data object (no url)
  t.ok(tasks.length === 0, '✓ no tasks when no url on data object')
  t.end();
});

test(file+'TASKER PROFILE - list of next tasks after scraping a profile', function(t){
  gs('iteles', function(err, data){
    var tasks = tasker(data);
    // console.log(tasks)
    var expected = [ // timestamps stripped
      'https://github.com/iteles/followers',
      'https://github.com/iteles/following',
      '/stars/iteles',
      '/ladieswhocode',
      '/bowlingjs',
      '/foundersandcoders',
      '/docdis',
      '/dwyl'
    ]
    var task_str = tasks.join(' ');
    expected.map(function(i) {
      t.ok(task_str.indexOf(i) > -1, '✓ Task list contains: '+ i )
    })
    t.ok(tasks.length > 0, '✓ New tasks: ' + tasks.length)
    t.end();
  })
});

test(file+'TASKER NEXT_PAGE - if the object has a next_page property', function(t){
  gs('alanshaw/followers', function(err, data){
    var tasks = tasker(data);
    console.log(tasks);
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('?page=2') > -1, '✓ next_page task: ' + data.next_page)
    t.end();
  })
});

test(file+'TASKER PROFILE REPOS - if tab=repositories add task for each repo', function(t){
  gs('iteles?tab=repositories', function(err, data) {
    var tasks = tasker(data);
        // console.log(tasks.length)
    var task_str = tasks.join(' ');
    t.ok(tasks.length > 20, '@iteles has ' + tasks.length + ' repos to crawl!')
    t.ok(task_str.indexOf('/iteles/Javascript-the-Good-Parts-notes') > -1, '✓ Task list contains Good Parts! ')
    t.end();
  })
});

test(file+'TASKER ORG REPOS - if org has repos add a task for each repo', function(t){
  var org = 'dwyl'
  gs(org, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
        // console.log(tasks.length)
    // var task_str = tasks.join(' ');
    t.ok(tasks.length > 20, '✓ ' + org +' has ' + tasks.length + ' repos to crawl!')
    t.end();
  })
});

test(file+'TASKER ORG - add task to scrape pages of people', function(t){
  var org = 'dwyl'
  gs(org, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
        // console.log(tasks)
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('/orgs/dwyl/people') > -1, '✓ ORG: ' +org + ' has ' +data.pcount + ' people!')
    t.end();
  })
});

test(file+'TASKER ORG - extract tasks from second page of repos', function(t){
  var url = '/dwyl?page=2'
  gs(url, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
    t.ok(tasks.length > 0, '✓ ORG: ' +url + ' has ' +data.pcount + ' people!')
    t.end();
  })
});

test(file+'TASKER ORG - No People Task for Org without Public People', function(t){
  var url = '/pandajs'
  gs(url, function(err, data) {
    console.log(' - - - - - - - - - - data:')
    console.log(data);
    var tasks = tasker(data);
    console.log(' - - - - - - - - - - tasks:')
    console.log(tasks);
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('people') === -1, '✓ ORG: ' +url + ' has ' +data.pcount + ' people!')
    t.end();
  })
});


test(file+'TASKER REPO: stargazers, issues, milestones & labels', function(t){
  var repo = 'dwyl/tudo'
  gs(repo, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
    console.log(tasks)
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('/stargazers') > -1, '✓ REPO: ' +repo + ' has ' +data.stars + ' stars!')
    t.ok(task_str.indexOf('/issues') > -1, '✓ REPO: ' +repo + ' has ' +data.stars + ' stars!')
    t.end();
  })
});

test(file+'TASKER REPO Stats - scrape people who star the repo', function(t){
  var repo = 'dwyl/time'
  gs(repo, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
    console.log(tasks)
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('/issues') > -1, '✓ REPO: ' +repo + ' has ' +data.stars + ' stars!')
    t.end();
  })
});

test(file+'TASKER Following lists all people as tasks', function(t){
  var url = 'rjmk/following'
  gs(url, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
    console.log(tasks)
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('anniva') > -1, '✓ Page: ' +url + ' has ' +data.stars + ' stars!')
    t.end();
  })
});

test(file+'TASKER Followers lists all people as tasks', function(t){
  var url = 'rjmk/followers'
  gs(url, function(err, data) {
    var tasks = tasker(data); // sync
    console.log(tasks)
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('iteles') > -1, '✓ '+url + ' has @iteles as follower!')
    t.end();
  })
});
