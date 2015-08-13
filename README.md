# arana

***arana*** crawls **GitHub** webpages for ***delicious data***

[![Build Status](https://travis-ci.org/nelsonic/arana.svg?branch=master)](https://travis-ci.org/nelsonic/arana)
[![Test Coverage](https://codeclimate.com/github/nelsonic/arana/badges/coverage.svg)](https://codeclimate.com/github/nelsonic/arana/coverage)
[![Dependency Status](https://david-dm.org/nelsonic/arana.svg)](https://david-dm.org/nelsonic/arana)
[![devDependency Status](https://david-dm.org/nelsonic/arana/dev-status.svg)](https://david-dm.org/nelsonic/arana#info=devDependencies)
<!--
[![Code Climate](https://codeclimate.com/github/nelsonic/arana/badges/gpa.svg)](https://codeclimate.com/github/nelsonic/arana)
-->

## Why?

> ***Why not...***?!

## What?

A spider.

![arana diagram](http://i.imgur.com/vSVXlku.jpg)

## How?

### Work Queue

A list of the tasks that need to be performed next.
The work-queue is stored as a **Sorted Set** where the **timestamp** (when the task was added to the work-queue) is the "**score**" and the value is the  **url** that needs to be crawled.  

![redis-work-queue](http://i.imgur.com/gzstALH.png)

```js
[
  'https://github.com/dwyl 1438948333290',
  'https://github.com/orgs/dwyl/people 1438948467205',
  'https://github.com/dwyl/summer-2015 1438948491989'
]
```

See: http://redis.io/topics/data-types



**Q**uestion: should we add all links on a page to the work queue immediately
***or*** only add links to the queue as we find them?  
**A**: I think we need to add all related links to the queue *immediately*
to ensure that we get content-complete as quickly as possible.

> Use Sorted Sets to Implement a Queue?
http://stackoverflow.com/a/8928885/1148249


### How Many Pages to Scroll Per Day?



## Name?

> see: https://www.google.pt/search?q=arana&tbm=isch
