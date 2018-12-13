import React from 'react'
import { Link } from 'gatsby'

export default class PostListing extends React.Component {
  getPostList() {
    return this.props.postEdges.map((postEdge) => {
      const { node } = postEdge
      return {
        path: node.fields.slug,
        tags: node.frontmatter.tags,
        cover: node.frontmatter.cover,
        title: node.frontmatter.title,
        date: node.fields.date,
        excerpt: node.excerpt,
        timeToRead: node.timeToRead
      }
    })
  }
  render() {
    const postList = this.getPostList()
    return (
      <div>
        {/* Your post list here. */
          postList.map(post => (
            <Link to={post.path} key={post.title}>
              <h1>{post.title}</h1>
            </Link>
          ))}
      </div>
    )
  }
}
