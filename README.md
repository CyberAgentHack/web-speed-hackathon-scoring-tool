# web-speed-hackathon-scoring-server

A scoring server for Web Speed Hackathon with Leaderboard.

## Build

```
yarn build
```

## Scoring

### Measure scores for all competitors

```
yarn scoring
```

### Mark a competitor DNF (Do Not Finished)

Set `eligible` flag to false in `src/targets.ts`.

## Leaderboard

### Generate the leaderboard

```
yarn leaderboard
```

### Generate the closed leaderboard

```
CLOSED=true yarn leaderboard
```
