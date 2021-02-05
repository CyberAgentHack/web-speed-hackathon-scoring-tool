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

export const competitors: ReadonlyArray<Competitor> = [];
