import path from 'path';
import fs from 'fs/promises';

import { MeasurementResult } from '../scoring';
import { getPublicDir, saveToPublicDir } from '../public_dir';
import { generateLeaderboard } from '../leaderboard';

async function getScores(): Promise<MeasurementResult[]> {
  const publicDir = getPublicDir();
  const files = await fs.readdir(publicDir);
  const scoreFilePaths = files
    .filter((name) => name.startsWith('scores-'))
    .map((name) => path.join(publicDir, name));
  const scores = await scoreFilePaths.reduce(
    async (prevPromise, scoreFilePath) => {
      const prev = await prevPromise;
      const scoresJson = await fs.readFile(scoreFilePath, { encoding: 'utf8' });
      const scores = JSON.parse(scoresJson);

      return prev.concat(scores);
    },
    Promise.resolve([]),
  );

  return scores;
}

async function main(): Promise<void> {
  const template = await fs.readFile(
    path.join(__dirname, '..', '..', 'src', 'template', 'index.handlebars'),
    { encoding: 'utf8' },
  );
  const scores = await getScores();
  const closed = process.env.CLOSED === 'true';
  const html = await generateLeaderboard(template, scores, closed);
  const htmlName = 'index.html';

  await saveToPublicDir(htmlName, html);
}

main().catch(console.error);
