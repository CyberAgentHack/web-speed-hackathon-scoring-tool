import handlebars from 'handlebars';
import { formatToTimeZone } from 'date-fns-timezone';

import { MeasurementResult } from './scoring';
import { competitors } from './targets';

type FormattedScore = MeasurementResult & {
  rank: number | null;
  ineligible: boolean;
  icon: string;
};

function formatScores(scores: MeasurementResult[]): FormattedScore[] {
  const ineligibleCompetitors = competitors
    .filter((c) => !c.eligible)
    .map((c) => c.id);

  return scores
    .map((score) => {
      const ineligible = ineligibleCompetitors.includes(score.competitorId);
      const icon = `https://github.com/${score.competitorId}.png`;

      return {
        ...score,
        ineligible,
        icon,
      };
    })
    .sort((a, b) => {
      if ('error' in a.result) {
        return 1;
      }

      if ('error' in b.result) {
        return -1;
      }

      return b.result.score - a.result.score;
    })
    .sort((_, b) => {
      return b.ineligible ? -1 : 1;
    })
    .map((score, index) => {
      const shouldBeUnranked =
        'error' in score.result || score.ineligible || score.result.score === 0;
      const rank = shouldBeUnranked ? null : index + 1;

      return {
        ...score,
        rank,
      };
    });
}

export async function generateLeaderboard(
  template: string,
  scores: MeasurementResult[],
  closed: boolean,
): Promise<string> {
  const sortedScores = formatScores(scores);
  const now = formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', {
    timeZone: 'Asia/Tokyo',
  });
  const templateDelegate = handlebars.compile(template);
  const html = templateDelegate({ competitors: sortedScores, now, closed });

  return html;
}
