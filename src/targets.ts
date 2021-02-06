export type Competitor = {
  id: string;
  url: string;
  eligible: boolean;
};

export const targetPaths: string[] = [
  // ホーム
  '/',
  // 投稿詳細ページ - 動画
  '/posts/01EXH20KRBVP34RYHYDTSX8JS2',
  // 投稿詳細ページ - 音声
  '/posts/01EQG3WDDBBTDKG1C5Y0A70EGB',
  // 投稿詳細ページ - 画像
  '/posts/01EWPC3XWCMVR15D8KESF7ATR7',
  // ユーザー詳細
  '/users/mexicandraggle',
  // 利用規約
  '/terms',
];

export const competitors: ReadonlyArray<Competitor> = [
  {
    id: 'champon1020',
    url: 'https://webspeedhackathon2021.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'noxhalt',
    url: 'https://still-lake-45373.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'tommy',
    url: 'https://webspeed.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'hijiki51',
    url: 'https://web-speed-hackathon-hijiki51.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'takuan',
    url: 'https://webspeed-app.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'YukiYada',
    url: 'https://cyber-hackathon.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'kenshin1025',
    url: 'https://webspead.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'morioprog',
    url: 'https://web-speed-hackathon-2021-z.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'tomohiroyoshida',
    url: 'https://speed-hackathon-2021-yoshida.herokuapp.com/',
    eligible: true,
  },
  {
    id: 'ninomiya',
    url: 'https://wsh-2021.herokuapp.com/',
    eligible: true,
  },
];
