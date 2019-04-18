const url = require('url')
const createPullRequest = require('./utils/createPullRequest')
const Octokit = require('@octokit/rest').plugin(createPullRequest)

const octokit = new Octokit()
octokit.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
})

const repo = 'functions-site'
const owner = 'davidwells'
const fileToChange = 'src/tutorials.json'

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  const { clientContext } = context
  const claims = clientContext && clientContext.user
  console.log('claims', claims)
  // if (!claims) {
  //   return callback(null, {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       data: 'NOT ALLOWED'
  //     })
  //   })
  // }

  const body = JSON.parse(event.body)
  console.log('body', body)

  if (!body || !body.name) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        data: 'request malformed'
      })
    })
  }

  // Get repo file contents
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

    const allData = parseFile(fileToChange, content)
    console.log('allData.length', allData.length)

    if (alreadyHasUri(body, allData)) {
      console.log(`${body.url} already is in the list!`)
      return callback(null, {
        statusCode: 422,
        body: JSON.stringify({
          message: `${body.url} already is in the list!`
        })
      })
    }

    const newData = allData.concat(body)
    const newContent = JSON.stringify(newData, null, 2)

    octokit.createPullRequest({
      owner,
      repo,
      title: `Add ${body.url}`,
      body: `Add ${body.name} at ${body.url}`,
      base: 'master', /* optional: defaults to default branch */
      head: `pull-request-branch-name-${new Date().getTime()}`,
      changes: {
        files: {
          [`${fileToChange}`]: newContent,
        },
        commit: `updating ${fileToChange}`
      }
    }).then((response) => {
      console.log('data', response.data)
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
 * Check if array already has URL
 * @return {Boolean}
 */
function alreadyHasUri(newItem, allData) {
  return allData.some((item) => {
    return niceUrl(item.url) === niceUrl(newItem.url)
  })
}

function niceUrl(href) {
  const { host, pathname } = url.parse(href)
  return `${host}${pathname}`
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
