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

You can subscribe to events from your `cool` instances in a declarative way:

```js
events: {
    'master -> type slave': function() {}
}
```
Where master (subject) could be the name of instance, generated event and slave (object) is a name of instance master is manipulated on. For example:
```js
events: {
    'library -> append photo': 'onPhotoAppend'
}
```
Will be fired, when someone will do `library.append(photo)`

You can subscribe to events of the current instance only:
```js
events: {
    'this -> append user': 'handler',
    'append user': 'handler' // the same
}
```

You can subscribe to every master and every slave of specified event:
```js
events: {
    '* -> append'
}
```

You can also subscribe to model's events:
```js
events: {
    'users -> fetched': 'onload'
}
```

You can also subscribe to DOM events:
```js
events: {
    '.b-button -> click': 'onsubmit'
}
```

#### View

##### Defenition
```js
cool.view({
    name: 'users',
    events: {
        'master -> type slave': 'handler'
    },
    views: ['store', 'search'] // this views will be rendered first
    models: ['users'] // current view will be rendered only after this model resolution
});

Each model will have event's methods (`on`, `off`, `emit`, `one`) and two `stores` `data` and `param`. `data` contains model's responses and `param` contains model's params.

##### Methods


`toJSON` - will return object with `data` and `param` values.

`html(json)` - renders html string from JSON, should be overwritten depending on your favorite template engine. Example for yate:
```js
cool.view.prototype.html = function(json) {
    return yr.run('main', json, 'cool-' + this.name);
};
```

`find(name|instance)` - will return first matched subview, by name or by instance reference

`render()` - genereates html after all all submodels and sub views are resolved.

`append(view)` - will add view to the current one. You can subscribe to append event and hack `operation` to specify where exactly to append subview:
```js
cool.view({
    name: 'users',
    events: {
        'append user': function(evt) {
            evt.operation.root = '.js-users-store';
        }
    }
});
```

`detach(skipDome)` - detaches view from parent view and from dome (if !skipDome)

`remove` - removes view, detaches it from everywhere

`empty` - removes every subview from the current one

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
