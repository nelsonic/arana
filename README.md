# arana

***arana*** crawls **GitHub** webpages for ***delicious data***

## Why?

> ***Why not...***?!

## What?

A spider.

![arana diagram](http://i.imgur.com/vSVXlku.jpg)

## How?

### Work Queue

A list of the tasks that need to be performed next.
A "task" is a **url** and the **timestamp** the task was added to the work queue.

```js
[
  'https://github.com/dwyl 1438948333290',
  'https://github.com/orgs/dwyl/people 1438948467205',
  'https://github.com/dwyl/summer-2015 1438948491989'
]
```

We are storing the Work Queue as a *simple* list because we don't ***need***
anything *fancy*!



**Q**uestion: should we add all links on a page to the work queue immediately
***or*** only add links to the queue as we find them?  
**A**: I think we need to add all related links to the queue *immediately*
to ensure that we get content-complete as quickly as possible.




## Name?

> see: https://www.google.pt/search?q=arana&tbm=isch
