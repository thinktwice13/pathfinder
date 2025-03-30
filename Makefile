.PHONY: setup clean run

setup:
	@if [ ! -d node_modules ]; then npm install; fi

dev: setup
	@read -p "Enter filepath [Skip to use sample file]: " FILEPATH; \
	npm run dev -- $${FILEPATH}

test: setup
	npm run test

clean:
	rm -rf node_modules dist coverage
