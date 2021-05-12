import request from 'request-promise-native';
import { createErr, createOk, isErr, Result } from 'option-t/cjs/PlainResult';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import floor from 'lodash.floor';

import type { Competitor } from './competitor';

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

type BuildInfo = {
  commitHash: string;
  buildDate: string;
};

export type MeasurementResult =
  | {
      competitorId: string;
      buildInfo: BuildInfo | null;
      result: HackathonScore;
    }
  | {
      competitorId: string;
      result: { error: Error };
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
  shouldMaskPath: boolean,
): Promise<LighthouseScoreList> {
  const result: LighthouseScoreList = {};
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox'],
  });

  try {
    for (const path of paths) {
      const url = `${entrypoint}${path}`;

      if (shouldMaskPath) {
        console.error(`URL: ${entrypoint}*****`);
      } else {
        console.error(`URL: ${url}`);
      }

      const lighthouseScore = await measurePage(url, chrome.port);

      console.error(`Lighthouse: ${JSON.stringify(lighthouseScore)}`);

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
  targetPaths: string[],
  shouldMaskPath: boolean,
): Promise<Result<HackathonScore, Error>> {
  console.error(`Competitor: ${competitor.id}`);

  try {
    const lighthouseScores = await measurePages(
      competitor.url,
      targetPaths,
      shouldMaskPath,
    );
    const hackathonScore = calculateHackathonScore(lighthouseScores);

    console.error(`Score: ${hackathonScore.score}`);

    return createOk(hackathonScore);
  } catch (e) {
    console.error(e);
    return createErr(e);
  }
}

async function fetchBuildInfo(
  competitor: Competitor,
): Promise<BuildInfo | null> {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox'],
  });

  try {
    const resp = await request(`http://localhost:${chrome.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp);
    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    await page.goto(competitor.url);

    const commitHash = (await page.evaluate(
      // @ts-expect-error window.__BUILD_INFO__ must be available
      () => window.__BUILD_INFO__?.COMMIT_HASH,
    )) as string;
    const buildDate = (await page.evaluate(
      // @ts-expect-error window.__BUILD_INFO__ must be available
      () => window.__BUILD_INFO__?.BUILD_DATE,
    )) as string;

    const buildInfo = {
      commitHash,
      buildDate,
    };

    console.error(buildInfo);

    return buildInfo;
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    await chrome.kill();
  }
}

async function measureAllCompetitors(
  competitors: Competitor[],
  targetPaths: string[],
  shouldMaskPath: boolean,
): Promise<MeasurementResult[]> {
  const results: MeasurementResult[] = [];

  for (const competitor of competitors) {
    const result = await measureCompetitor(
      competitor,
      targetPaths,
      shouldMaskPath,
    );

    if (isErr(result)) {
      results.push({
        competitorId: competitor.id,
        result: { error: result.err },
      });
      continue;
    }

    const buildInfo = await fetchBuildInfo(competitor);

    results.push({
      competitorId: competitor.id,
      buildInfo,
      result: result.val,
    });
  }

  return results;
}

export async function scoring(
  competitors: Competitor[],
  targetPaths: string[],
  shouldMaskPath = false,
): Promise<MeasurementResult[]> {
  const results = await measureAllCompetitors(
    competitors,
    targetPaths,
    shouldMaskPath,
  );
  return results;
}
