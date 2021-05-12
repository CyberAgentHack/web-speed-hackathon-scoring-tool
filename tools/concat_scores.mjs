import path from 'path';
import { promises as fs } from 'fs';

async function getScores(directory) {
  const files = await fs.readdir(directory);
  const scoreFilePaths = files
    .filter((name) => name.startsWith('scores-'))
    .map((name) => path.join(directory, name));

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

async function main() {
  if (!process.env.RESULT_DIR) {
    console.error('process.env.RESULT_DIR is not defined.');
    process.exit(1);
  }

  const dir = path.join(process.cwd(), process.env.RESULT_DIR);
  const scores = await getScores(dir);

  console.log(JSON.stringify(scores));
}

main().catch(console.error);
