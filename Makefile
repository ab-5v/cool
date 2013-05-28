NBIN=$(CURDIR)/node_modules/.bin
OUTPUT=index.js

$(OUTPUT): lib/*.js test/spec/*.js bower_modules node_modules
	$(NBIN)/borschik -i lib/cool.js -o $(OUTPUT) --minimize=no

test: $(OUTPUT)
	npm test

clean:
	rm $(OUTPUT)
	rm -rf node_modules
	rm -rf bower_modules

node_modules: package.json
	npm install

bower_modules: bower.json
	bower install

.PHONY: clean
