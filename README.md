# web-speed-hackathon-scoring-tool

A scoring tool for Web Speed Hackathon.

## Build

```
yarn build
```

## Measure

### Preparation

1. Copy config/default.json and rename it to `local.json`.
2. Populate `pages` property with paths to be measured, **without** the preceding slash `/`.

For example, if you want to measure these three pages `/`, `/posts/a`, `/posts/b` to calculate a score, your `local.json` becomes:

```json
{
  "pages": ["", "posts/a", "posts/b"]
}
```

### Run

```
yarn scoring https://example.com/path/to/deployed/app/
```

Please make sure that the URL should end with a trailing slash `/`.
