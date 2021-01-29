import { patchError } from '../jsonable_error';
import { saveToPublicDir } from '../public_dir';
import { scoring } from '../scoring';
import { competitors } from '../targets';

async function main(): Promise<void> {
  patchError();

  const PARALLEL_COUNT = Number(process.env.PARALLEL_COUNT) || 1;
  const TARGET_GROUP = Number(process.env.TARGET_GROUP) || 0;

  const competitorsGroup = competitors.filter(
    (_, index) => index % PARALLEL_COUNT === TARGET_GROUP,
  );

  const results = await scoring(competitorsGroup);
  const jsonName = `scores-${TARGET_GROUP}.json`;

  await saveToPublicDir(jsonName, JSON.stringify(results));
}

main().catch(console.error);
