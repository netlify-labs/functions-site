const url = require('url')
const gitUrlParse = require('git-url-parse')
const createPullRequest = require('./utils/createPullRequest')
const sanitizeTitle = require('./utils/sanitize')
const Octokit = require('@octokit/rest').plugin(createPullRequest)

const { REPOSITORY_URL } = process.env
const octokit = new Octokit()
octokit.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
})

const FILE_TO_CHANGE = 'data/tutorials.json'

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
  const parsed = gitUrlParse('https://github.com/netlify-labs/functions-site')
  const repo = parsed.name
  const owner = parsed.owner
  const body = JSON.parse(event.body)

  if (!repo || !owner) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: 'process.env.REPOSITORY_URL malformed'
      })
    }
  }

  if (!body || !body.title) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: 'Request malformed. Missing Title'
      })
    }
  }

  const cleanTitle = sanitizeTitle(body.title)
  console.log('cleanTitle', cleanTitle)
  if (!cleanTitle) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: 'Request malformed. Bad data has been passed in'
      })
    }
  }

  // Get repo file contents
  let result
  try {
    result = await octokit.repos.getContents({
      owner,
      repo,
      path: FILE_TO_CHANGE
    })
  } catch (err) {
    console.log('octokit.repos.getContents err', err)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `${err.message}`
      })
    }
  }

  if (typeof result.data === 'undefined') {
    // createFile(octokit, config, file, content)
    // throw file doesnt exist
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `No ${FILE_TO_CHANGE} found`
      })
    }
  }

  // content will be base64 encoded
  const content = Buffer.from(result.data.content, 'base64').toString()

  const allData = parseFile(FILE_TO_CHANGE, content)
  console.log('allData.length', allData.length)

  if (alreadyHasUri(body, allData)) {
    console.log(`${body.url} already is in the list!`)
    return {
      statusCode: 422,
      body: JSON.stringify({
        message: `${body.url} already is in the list!`
      })
    }
  }

  const newData = allData.concat(body)
  const newContent = JSON.stringify(newData, null, 2)

  let response = {}
  try {
    response = await octokit.createPullRequest({
      owner,
      repo,
      title: `Add tutorial ${body.url}`,
      body: `Add ${body.title} at ${body.url}`,
      base: 'master', /* optional: defaults to default branch */
      head: `pull-request-branch-name-${new Date().getTime()}`,
      changes: {
        files: {
          [`${FILE_TO_CHANGE}`]: newContent,
        },
        commit: `updating ${FILE_TO_CHANGE}`
      }
    })
  } catch (err) {
    if (err.status === 422) {
      console.log('BRANCH ALREADY EXISTS!')
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `BRANCH ALREADY EXISTS!`
        })
      }
    }
  }
  console.log('data', response.data)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `pr created!`,
      url: response.data.html_url
    })
  }
}

/**
 * Check if array already has URL
 * @return {Boolean}
 */
function alreadyHasUri(newItem, allData) {
  return allData.some((item) => {
    if (!item.url || !newItem.url) {
      return false
    }
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
