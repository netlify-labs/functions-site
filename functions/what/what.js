const Octokit = require('@octokit/rest').plugin(require('./createPullRequest'))

const octokit = new Octokit()
octokit.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
})

const repo = 'visiJAM'
const owner = 'davidwells'
const fileToChange = 'form-schema.json'

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  octokit.repos.getContents({
    owner,
    repo,
    path: fileToChange
  }).then(result => {
    if (typeof result.data === 'undefined') {
      // createFile(octokit, config, file, content)
      // throw file doesnt exist
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: `No ${fileToChange} found`
        })
      })
    }
    // content will be base64 encoded
    const content = Buffer.from(result.data.content, 'base64').toString()

    const c = parseFile(fileToChange, content)

    c['new-thing-two'] = 'wowowowowowow'

    const newContent = JSON.stringify(c, null, 2)
    console.log('newContent', newContent)
    // const newContent = `${content}wowowoow`

    octokit.createPullRequest({
      owner,
      repo,
      title: 'pull request title',
      body: 'pull request description',
      base: 'master', /* optional: defaults to default branch */
      head: 'pull-request-branch-name-seven',
      changes: {
        files: {
          [`${fileToChange}`]: newContent,
        },
        commit: `updating ${fileToChange}`
      }
    }).then((response) => {
      console.log('data', response)
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `pr created!`,
          url: response.data.html_url
        })
      })
    }).catch((e) => {
      console.log('error', e)
      if (e.status === 422) {
        console.log('BRANCH ALREADY EXISTS!')
        return callback(null, {
          statusCode: 400,
          body: JSON.stringify({
            error: `BRANCH ALREADY EXISTS!`
          })
        })
      }
    })
  })
}

/**
 * Stringify to JSON maybe.
 *
 * @param  {string} file
 * @param  {string} content
 *
 * @return {string}
 */
function parseFile(file, content) {
  if (file.indexOf('.json') !== -1) {
    return JSON.parse(content)
  }

  return content
}
