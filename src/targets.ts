export type Competitor = {
  id: string;
  url: string;
  eligible: boolean;
};

export const targetPaths: string[] = ['/', '/test'];

export const competitors: ReadonlyArray<Competitor> = [
  {
    id: 'nodaguti',
    url: 'https://example.com',
    eligible: true,
  },
  {
    id: 'kubosho',
    url: 'https://example.com',
    eligible: true,
  },
  {
    id: 'xx',
    url: 'https://example.com',
    eligible: true,
  },
  {
    id: 'yy',
    url: 'https://example.com',
    eligible: false,
  },
  {
    id: 'zz',
    url: 'https://example.com',
    eligible: true,
  },
];
