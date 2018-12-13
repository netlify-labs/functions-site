import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layouts/Default'
import Disqus from '../components/Disqus/Disqus'
import PostTags from '../components/PostTags/PostTags'
import SEO from '../components/SEO/SEO'
import config from '../../_site-config'
import './b16-tomorrow-dark.css'
import './post.global.css'

export default class PostTemplate extends React.Component {
  render() {
    const { slug } = this.props.pageContext
    const postNode = this.props.data.markdownRemark
    const post = postNode.frontmatter
    if (!post.id) {
      post.id = slug
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID
    }
    return (
      <Layout>
        <div className='lol'>
          <Helmet>
            <title>{`${post.title} | ${config.siteTitle}`}</title>
          </Helmet>
          <SEO postPath={slug} postNode={postNode} postSEO />
          <div>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
            <div className="post-meta">
              <PostTags tags={post.tags} />
            </div>
            <Disqus postNode={postNode} />
          </div>
        </div>
      </Layout>
    )
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        date
        category
        tags
      }
      fields {
        nextTitle
        nextSlug
        prevTitle
        prevSlug
        slug
        date
      }
    }
  }
`
