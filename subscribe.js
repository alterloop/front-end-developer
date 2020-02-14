/*!
 *
 *
 */

require('dotenv').config()

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const { readdirSync } = require('fs')
const username = process.argv[2] || null

function error(message) {
  console.log('>>> ERROR:', message)
  process.exit(1)
}

if (!username) {
  error('Missing username')
}

readdirSync('modules', { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(dir => {
    octokit.projects.createForRepo({
      owner: 'forgeh',
      repo: 'front-end-developer',
      name: dir.name + '/@' + username,
    }).then((resp) => {
      octokit.projects.listColumns({
        project_id: resp.data.id
      }).then((resp) => {
        console.log(resp);
        process.exit();
      })
    })
  })

/*




// Compare: https://developer.github.com/v3/repos/#list-organization-repositories
octokit.repos
  .listForOrg({
    org: "octokit",
    type: "public"
  })
  ;*/
