import { createErr, createOk, Result, tapBoth } from 'option-t/cjs/PlainResult';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import floor from 'lodash.floor';

import { Competitor, targetPaths } from './targets';

type LighthouseScore = {
  score: number;
  firstContentfulPaint: number;
  speedIndex: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
};

type LighthouseScoreList = {
  [path: string]: LighthouseScore;
};

type HackathonScore = {
  score: number;
  lighthouseScores: LighthouseScoreList;
};

export type MeasurementResult = {
  competitorId: string;
  result: HackathonScore | { error: Error };
};

async function measurePage(
  url: string,
  port: number,
): Promise<LighthouseScore> {
  const settings = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance'],
    onlyAudits: [
      'first-contentful-paint',
      'speed-index',
      'largest-contentful-paint',
      'time-to-interactive',
      'total-blocking-time',
      'cumulative-layout-shift',
    ],
    port,
  };
  const config = {
    extends: 'lighthouse:default',
  };
  const runnerResult = await lighthouse(url, settings, config);
  const lhr = runnerResult.lhr;
  const result: LighthouseScore = {
    score: (lhr.categories.performance?.score ?? 0) * 100,
    firstContentfulPaint: lhr.audits['first-contentful-paint']?.score ?? 0,
    speedIndex: lhr.audits['speed-index']?.score ?? 0,
    largestContentfulPaint: lhr.audits['largest-contentful-paint']?.score ?? 0,
    timeToInteractive: lhr.audits['time-to-interactive']?.score ?? 0,
    totalBlockingTime: lhr.audits['total-blocking-time']?.score ?? 0,
    cumulativeLayoutShift: lhr.audits['cumulative-layout-shift']?.score ?? 0,
  };

  return result;
}

async function measurePages(
  entrypoint: string,
  paths: string[],
): Promise<LighthouseScoreList> {
  const result: LighthouseScoreList = {};
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox'],
  });

  try {
    for (const path of paths) {
      const url = `${entrypoint}${path}`;

      console.log(`URL: ${url}`);

      const lighthouseScore = await measurePage(url, chrome.port);

      console.log(`Lighthouse: ${JSON.stringify(lighthouseScore)}`);

      result[path] = lighthouseScore;
    }

    return result;
  } finally {
    await chrome.kill();
  }
}

function calculateHackathonScore(
  lighthouseScores: LighthouseScoreList,
): HackathonScore {
  const score = Object.values(lighthouseScores).reduce((sum, lh) => {
    return (
      sum +
      lh.score +
      lh.firstContentfulPaint * 3 +
      lh.speedIndex * 3 +
      lh.largestContentfulPaint * 5 +
      lh.timeToInteractive * 3 +
      lh.totalBlockingTime * 5 +
      lh.cumulativeLayoutShift * 1
    );
  }, 0);
  const roundedScore = floor(score, 2);

  return {
    score: roundedScore,
    lighthouseScores,
  };
}

async function measureCompetitor(
  competitor: Competitor,
): Promise<Result<HackathonScore, Error>> {
  console.log(`Competitor: ${competitor.id}`);

  try {
    const lighthouseScores = await measurePages(competitor.url, targetPaths);
    const hackathonScore = calculateHackathonScore(lighthouseScores);

    console.log(`Score: ${hackathonScore.score}`);

    return createOk(hackathonScore);
  } catch (e) {
    console.error(e);
    return createErr(e);
  }
}

async function measureAllCompetitors(
  competitors: Competitor[],
): Promise<MeasurementResult[]> {
  const results: MeasurementResult[] = [];

  for (const competitor of competitors) {
    const result = await measureCompetitor(competitor);

    tapBoth(
      result,
      (ok) => {
        results.push({
          competitorId: competitor.id,
          result: ok,
        });
      },
      (error) => {
        results.push({
          competitorId: competitor.id,
          result: { error },
        });
      },
    );
  }

  return results;
}

export async function scoring(
  competitors: Competitor[],
): Promise<MeasurementResult[]> {
  const results = await measureAllCompetitors(competitors);
  return results;
}
