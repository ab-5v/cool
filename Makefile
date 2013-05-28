NBIN=$(CURDIR)/node_modules/.bin
OUTPUT=index.js

all: node_modules bower_modules index.js

index.js: lib/*.js
	$(NBIN)/borschik -i lib/cool.js -o $(OUTPUT) --minimize=no

clean:
	rm $(OUTPUT)
	rm -rf node_modules
	rm -rf bower_modules

node_modules: package.json
	npm install

bower_modules: bower.json
	bower install

.PHONY: clean
