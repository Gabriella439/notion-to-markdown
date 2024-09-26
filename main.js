const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fetch = require('node-fetch');
const fs = require('fs').promises;

const notionClient = new Client({ auth: process.env['INPUT_NOTION-TOKEN'] });

const notionToMarkdown = new NotionToMarkdown({ notionClient });

(async () => {
  const search = await notionClient.search({});

  search.results.forEach (async result => {
    const baseName = result.url.split('/').pop();

    const blocks = await notionToMarkdown.pageToMarkdown(result.id);

    const { parent } = notionToMarkdown.toMarkdownString(mdBlocks = blocks);

    if(typeof parent !== "undefined") {
      await fs.writeFile(`${baseName}.md`, parent);
    }
  });
})();
