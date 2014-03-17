NBIN=$(CURDIR)/node_modules/.bin
OUTPUT=index.js

$(OUTPUT): lib/*.js node_modules bower_modules
	$(NBIN)/borschik -i lib/cool.js -o $(OUTPUT) --minimize=no

test: $(OUTPUT) test/spec/*.js test/mock/*.js test/index.html
	$(NBIN)/jshint --verbose lib/*.js test/spec/*.js test/mock/*.js
	npm test

test-cov: index-cov
	$(NBIN)/mocha-phantomjs -R json-cov test/index-cov.html | $(NBIN)/json2htmlcov > coverage.html

index-cov: $(OUTPUT) clean-index-cov
	mkdir -p index
	cp $(OUTPUT) index
	$(NBIN)/jscoverage --no-highlight index index-cov

clean-index-cov:
	rm -rf index index-cov
	rm -f coverage.html

clean: clean-index-cov
	rm -rf node_modules
	rm -rf bower_modules

node_modules: package.json
	npm install

bower_modules: bower.json
	$(NBIN)/bower install

.PHONY: clean test test-cov
