test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec "./**/*.mspec.js"

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch "./**/*.mspec.js"

test-cov:
	@NODE_NV=test ./node_modules/.bin/istanbul cover --hook-run-in-context ./node_modules/.bin/_mocha -- "./**/*.mspec.js"

.PHONY: test test-w test-cov