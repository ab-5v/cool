cool [![Build Status](https://api.travis-ci.org/artjock/cool.png?branch=master)](https://travis-ci.org/artjock/cool)
====

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

To run only tests:
```
npm test
```

During development procces, you can watch your code and run test automatically:
```
npm start
```

#### Tests Coverage

```
make test-cov
```

It will generate `coverage.html`, you can browse it in your browser
