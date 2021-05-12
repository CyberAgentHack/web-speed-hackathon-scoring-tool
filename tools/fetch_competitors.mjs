import request from 'request-promise-native';

async function main() {
  if (!process.env.COMPETITORS_SPREADSHEET_JSON) {
    console.error('process.env.COMPETITORS_SPREADSHEET_JSON is not defined.');
    process.exit(1);
  }

  const res = await request(process.env.COMPETITORS_SPREADSHEET_JSON);
  const json = JSON.parse(res);
  const entries = json.feed.entry;

  const competitors = entries.map((entry) => {
    const id = entry['gsx$id']['$t'];
    const url = entry['gsx$デプロイ先url']['$t'];

    return {
      id,
      url,
    };
  });

  console.log(JSON.stringify(competitors));
}

main().catch(console.error);
