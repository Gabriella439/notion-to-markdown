This action exports all documents an integration can access within a Notion
workspace to markdown files.

#### Usage

You will need to create a Notion integration with an API token in order to power
the Notion export.  In other to do that you will need to follow the instructions
here:

- [Create your integration in Notion](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)

Once you create the integration update the Capabilities section to only grant
your integration access to "Read content" and nothing else.  This is the only
required permission to power the Notion export.

After you've narrowed the permissions, get the API secret by following the
instructions here:

- [Get your API secret](https://developers.notion.com/docs/create-a-notion-integration#get-your-api-secret)

Copy that "Internal Integration Secret" and visit the secrets page for your
repository, which is located at:

```
https://github.com/${owner}/${repository}/settings/secrets/actions
```

… and click the "New repository secret" to add a new secret named
`NOTION_TOKEN` (any name will do, as long as it matches the name you reference
in your GitHub workflow):

![](https://github.com/user-attachments/assets/67f7ef98-0b61-4e36-ac5f-2f37b76bf6c4)

… and then pass that secret as an input to this GitHub action:

```
- uses: Gabriella439/notion-to-markdown@main
  with:
    notion-token: ${{ secrets.NOTION_TOKEN }}
```

Finally, grant the integration access to the Notion pages you want to export by
following the instructions here:

- [Give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)

Now any time the GitHub action runs it will export the pages you granted access
to as local files of the same name within its current working directory.

If you want to add those exported files to version control then you will
probably want to combine this GitHub action with the `actions/checkout` and the
`EndBug/add-and-commit` GitHub actions.  See the next section for a worked
example.

#### Example

Here is an example GitHub workflow that shows how you can create a manual or
daily export of your notion workspace to the current repository:

```yaml
name: Import Notion
on:
  workflow_dispatch:
  schedule:
  - cron: '0 0 * * *'
jobs:
  import-notion:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: 'rm --force -- *.md'
    - uses: Gabriella439/notion-to-markdown@main
      with:
        notion-token: ${{ secrets.NOTION_TOKEN }}
    - uses: EndBug/add-and-commit@v9
```
