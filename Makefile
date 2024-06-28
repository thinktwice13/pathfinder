PHONY: clean run

dev:
	[ -d node_modules ] || npm install
	@read -p "Enter filepath [Skip to use sample file]: " FILEPATH; \
	npm run dev -- $${FILEPATH}

clean:
	rm -rf node_modules dist coverage
