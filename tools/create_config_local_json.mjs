async function main() {
  if (!process.env.CONFIG_DIR) {
    console.error('process.env.CONFIG_DIR is not defined.');
    process.exit(1);
  }

  if (!process.env.TARGET_PAGES) {
    console.error('process.env.TARGET_PAGES is not defined.');
    process.exit(1);
  }

  const pagesStr = process.env.TARGET_PAGES;
  const pages = pagesStr.split(',');

  console.log(JSON.stringify({ pages }));
}

main().catch(console.error);
