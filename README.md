cool [![Build Status](https://api.travis-ci.org/artjock/cool.png?branch=master)](https://travis-ci.org/artjock/cool)
====

Event driven framework for quick prototyping.


### Usage

```bash
bower install cool
```

```html
<script src="./components/jquery/dist/jquery.js"></script>
<script src="./components/xtend/index.js"></script>
<script src="./components/pzero/pzero.js"></script>
<script src="./components/cool/index.js"></script>
```

### API

#### Method

```js
cool.method(name, method, silent);
//or
cool.method(dest, methods);
```

Most of cool component's methods are build with `cool.method`. That what makes `cool` so event driven. `cool.method` produces an method and adds pre- and post- execution events. The name of the pre-event is the same as method name, and post-event has 'ed' postfix. In the pre-event you can cancel action execution or delay it. If action returns 'A+ promise', then the post-event will be called only after promise resolution.

Example:

```js
cool.method(coolObj, {
  shout: function() {
    alert('Hi all');
  }
});

coolObj.on('shout', function(evt) {
  if (window.sleepy) { evt.prevetDefault(); }
  if (window.wait) {
    setTimeout(function() { evt.action(); }, 1000);
  }
});

coolObj.on('shouted', function() {
  alert('Hi');
});
```

#### Store

```js
xtnd(coolObj, cool.store('data'));
```

Creates data getter/setter with specified name. Every modification generates modification log `{before: { ... }, after: { ... }}`.

```js
coolObj.data()                    // returns whole object
coolObj.data(name)                // returns property 'name'
coolObj.data(name, value)         // setups property 'name'
coolObj.data({})                  // setups the whole object
coolObj.data(true, {})            // extends object
coolObj.data(true, name, value)   // extends adds 'value' to 'name' (push to array)
coolObj.data(false)               // empties whole data
coolObj.data(false, name)         // removes property 'name'
coolObj.data(false, name, value)  // removes 'value' from 'name'
```

#### Events
#### View
#### Model

### Development

Clone repository, then:

```
make
```

#### Tests

To hint you code and run test execute:
```
make test
```

To run tests only:
```
npm test
```

During development procces, you can watch your code and run tests automatically:
```
npm start
```

#### Tests Coverage

```
make test-cov
```

It will generate `coverage.html`, you can open it in your browser
