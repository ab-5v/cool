NBIN=$(CURDIR)/node_modules/.bin
OUTPUT=index.js

$(OUTPUT): lib/*.js bower_modules node_modules
	$(NBIN)/borschik -i lib/cool.js -o $(OUTPUT) --minimize=no

test: $(OUTPUT) test/spec/*.js test/mock/*.js test/index.html
	$(NBIN)/jshint --verbose lib/*.js test/spec/*.js test/mock/*.js
	npm test

clean:
	rm $(OUTPUT)
	rm -rf node_modules
	rm -rf bower_modules

node_modules: package.json
	npm install

bower_modules: bower.json
	$(NBIN)/bower install

.PHONY: clean test
