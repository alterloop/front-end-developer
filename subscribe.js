/*!
 *
 *
 */

require('dotenv').config()

const { Octokit } = require("@octokit/rest")
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })
const { readdirSync } = require('fs')
const fs = require('fs')
const yaml = require('js-yaml')
const username = process.argv[2] || null

function error(message) {
  console.log('>>> ERROR:', message)
  process.exit(1)
}

function createProject(projectName, cb) {
  octokit.projects.createForRepo({
    owner: 'forgeh',
    repo: 'front-end-developer',
    name: projectName,
  }).then((resp) => {
    let projectId = resp.data.id
    octokit.projects.createColumn({
      name: 'Backlog',
      project_id: projectId,
    }).then((resp) => {
      octokit.projects.createColumn({
        name: 'To-do',
        project_id: projectId,
      }).then((resp) => {
        octokit.projects.createColumn({
          name: 'In progress',
          project_id: projectId,
        }).then((resp) => {
          octokit.projects.createColumn({
            name: 'Done',
            project_id: projectId,
          }).then((resp) => {
            cb(projectId)
          })
        })
      })
    })
  })
}

if (!username) {
  error('Missing username')
}

readdirSync('modules', { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(dir => {
    let projectFile = 'modules/' + dir.name + '/project.yml'
    console.log("PF", projectFile)
    //createProject(dir.name + '/@' + username, (projectId, backlogId) => {
    try {
      let project = yaml.safeLoad(fs.readFileSync(projectFile, 'utf8'))
      let countTask = 0;
      if (countTask < project.tasks.length) {
        createTask(3958660, project.tasks[countTask], () => {
          if (++countTask < project.tasks.length) {

          }
        })
      }
      console.log(project.tasks)
    } catch (e) {
      console.log(e);
    }
      //console.log("New project:", projectId);
    //})
  })



/*




// Compare: https://developer.github.com/v3/repos/#list-organization-repositories
octokit.repos
  .listForOrg({
    org: "octokit",
    type: "public"
  })
  ;*/
