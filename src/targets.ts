export type Competitor = {
  id: string;
  url: string;
  eligible: boolean;
};

export const targetPaths: string[] = ['/', '/test'];

export const competitors: ReadonlyArray<Competitor> = [];
