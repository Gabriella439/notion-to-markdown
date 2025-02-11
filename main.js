const { Client } = require('@notionhq/client');
const core = require('@actions/core');
const { NotionToMarkdown } = require('notion-to-md');
const { backOff } = require('exponential-backoff');
const fs = require('fs').promises;

const notionClient = new Client({ auth: process.env['INPUT_NOTION-TOKEN'] });

const notionToMarkdown = new NotionToMarkdown({ notionClient });

(async () => {
  let arguments = { };

  let search = { };

  do {
    search = await notionClient.search(arguments);

    for (const result of search.results) {
      const baseName = result.url.split('/').pop();

      const backoffOptions = {
        startingDelay: 60 * 60 * 1000,
        numOfAttempts: 2,
        timeMultiple: 1,
      };

      const mdBlocks = await backOff(() => notionToMarkdown.pageToMarkdown(result.id), backoffOptions);

      const { parent } = notionToMarkdown.toMarkdownString(mdBlocks);

      if(typeof parent !== "undefined") {
        await fs.writeFile(`${baseName}.md`, parent);
      }
    }

    if (search.has_more) {
      arguments = { start_cursor: search.next_cursor };
    }
  } while (search.has_more);
})();
