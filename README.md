# web-speed-hackathon-scoring-server

A scoring server for Web Speed Hackathon with Leaderboard.

## Build

```
yarn build
```

## Measure scores for all competitors

```
yarn scoring
```

## Generate the leaderboard

```
yarn leaderboard
```

## Mark a competitor DNF (Do Not Finished)

Set `eligible` flag to false in `src/targets.ts` and run `yarn leaderboard` again.
