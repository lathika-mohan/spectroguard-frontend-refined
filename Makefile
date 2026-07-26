.PHONY: install dev build test test-watch lint clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

test-watch:
	npm run test:watch

lint:
	npm run lint

clean:
	rm -rf node_modules dist
