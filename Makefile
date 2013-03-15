all: cool.js node_modules

cool.js: lib/*.js
	requirer lib/root.js $@
	jshint $@

clean:
	rm cool.js

node_modules: package.json
	npm install

.PHONY: clean
