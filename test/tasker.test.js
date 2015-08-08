var test   = require('tape');
var tasker = require('../lib/tasker');
var gs     = require('github-scraper');

test('TASKER PROFILE - list of next tasks after scraping a profile', function(t){
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
      t.ok(task_str.indexOf(i) > -1, 'Task list contains: '+ i )
    })
    t.ok(tasks.length > 0, 'New tasks: ' + tasks.length)
    t.end();
  })
});

test('TASKER NEXT_PAGE - if the object has a next_page property', function(t){
  gs('alanshaw/followers', function(err, data){
    var tasks = tasker(data);
    t.ok(tasks[0].indexOf('?page=2') > -1, 'next_page task: ' + tasks[0])
    t.end();
  })
});

test('TASKER PROFILE REPOS - if tab=repositories add task for each repo', function(t){
  gs('iteles?tab=repositories', function(err, data) {
    var tasks = tasker(data);
        // console.log(tasks.length)
    var task_str = tasks.join(' ');
    t.ok(tasks.length > 20, '@iteles has ' + tasks.length + ' repos to crawl!')
    t.ok(task_str.indexOf('/iteles/Javascript-the-Good-Parts-notes') > -1, 'Task list contains Good Parts! ')
    t.end();
  })
});

test('TASKER ORG REPOS - if org has repos add a task for each repo', function(t){
  var org = 'dwyl'
  gs(org, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
        // console.log(tasks.length)
    // var task_str = tasks.join(' ');
    t.ok(tasks.length > 20, org +' has ' + tasks.length + ' repos to crawl!')
    t.end();
  })
});

test('TASKER ORG - add task to scrape pages of people', function(t){
  var org = 'dwyl'
  gs(org, function(err, data) {
    // console.log(data);
    var tasks = tasker(data);
        console.log(tasks)
    var task_str = tasks.join(' ');
    t.ok(task_str.indexOf('/orgs/dwyl/people') > -1, 'ORG: ' +org + ' has ' +data.pcount + ' people!')
    t.end();
  })
});
