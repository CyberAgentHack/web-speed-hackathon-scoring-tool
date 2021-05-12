import { promises as fs } from 'fs';
import config from 'config';

import { patchError } from '../jsonable_error';
import { scoring } from '../scoring';
import { Competitor } from '../competitor';

const USAGE = 'Usage: yarn scoring https://example.com/path/to/deployed/app/';

async function main(): Promise<void> {
  patchError();

  const target = process.argv[2];

  if (!target) {
    console.error(USAGE);
    return;
  }

  if (!(target.startsWith('https://') || target.endsWith('.json'))) {
    console.error(USAGE);
    return;
  }

  const paths = config.get('pages') as string[];

  if (!Array.isArray(paths) || paths.length === 0) {
    console.error(
      'A list of pages must be defined at config/local.json. See config/default.json as an example.',
    );
    return;
  }

  if (target.startsWith('https://')) {
    const competitor: Competitor = {
      id: '(cli)',
      url: target,
    };

    await scoring([competitor], paths);
    return;
  }

  const competitors = JSON.parse(
    await fs.readFile(target, { encoding: 'utf-8' }),
  ) as Competitor[];

  const PARALLEL_COUNT = Number(process.env.PARALLEL_COUNT) || 1;
  const TARGET_GROUP = Number(process.env.TARGET_GROUP) || 0;
  const shouldMaskPath = process.env.MASK_PATH === 'true';
  const competitorsGroup = competitors.filter(
    (_, index) => index % PARALLEL_COUNT === TARGET_GROUP,
  );

  const results = await scoring(competitorsGroup, paths, shouldMaskPath);

  console.log(JSON.stringify(results));
}

main().catch(console.error);
