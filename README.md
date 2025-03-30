# Pathfinder
> Find path from `@` to `x` in a map loaded from a file.

### Problem
https://gist.github.com/tuomasj/8061c6940d74d3ab55bbea582e6c8f24

### How to use
- `npm install` or `make setup` to install dependencies.
- `npm run dev -- <FILEPATH>` or `make dev` to run in development.
- `npm run test` or `npm run test:watch` for tests.
- `make clean` for cleanup (`node_modules`, `coverage`, `dist`)

### Example
```bash
$ npm run start -- ./maps/map1.txt
```

### Notes
- Only `.txt` and `.json` files supported.
