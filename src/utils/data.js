import data from '../data.json'

const tags = data.reduce((acc, curr) => {
  if (curr.tags) {
    acc = acc.concat(curr.tags)
  }
  return acc
}, [])

const uniqueTagsSet = new Set(tags)
const uniqueTags = Array.from(uniqueTagsSet)
export { uniqueTags }
