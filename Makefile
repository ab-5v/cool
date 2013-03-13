
cool.js: lib/*.js
	requirer lib/root.js cool.js

clean:
	rm cool.js

.PHONY: clean
