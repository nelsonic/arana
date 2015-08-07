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
    task_str = tasks.join(' ');
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
