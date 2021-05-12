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

## How this tool determines your score

Your score is a sum of _page score_ of each page, where _page score_ is a sum of [Lighthouse v6 Performance score](https://web.dev/performance-scoring/) and weighted relative score of each metric:

```
Page Score (0-120 pts) =
    Lighthouse v6 Performance score             (0-100 pts)
  + First Contentful Paint relative score   * 3 (0-3 pts)
  + Speed Index relative score              * 3 (0-3 pts)
  + Largest Contentful Paint relative score * 5 (0-5 pts)
  + Time To Interactive relative score      * 3 (0-3 pts)
  + Total Blocking Time relative score      * 5 (0-5 pts)
  + Cumulative Layout Shift relative score  * 1 (0-1 pts)
```

Thus when 5 pages are picked up to be measured to get a score, the maximum points will be 600 (= 120 \* 5).
