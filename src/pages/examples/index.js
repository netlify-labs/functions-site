import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import Layout from '../../layouts/Default'
import SEO from '../../components/SEO/SEO'
import Grid from '../../fragments/Grid'
import data from '../../../data/examples.json'
import { paramsParse } from 'analytics-utils'
import Button from '../../components/Button'
import Icon from '../../components/Icon'
import analytics from '../../analytics'
import styles from './Examples.css'

const tags = data.reduce((acc, curr) => {
  if (curr.tags) {
    acc = acc.concat(curr.tags)
  }
  return acc
}, [])
const uniqueTags = new Set(tags)

export default class Examples extends React.Component {
  constructor (props, context) {
    super(props, context)
    const params = paramsParse()
    const search = (!params.search || params.search === true) ? '' : params.search

    this.state = {
      tag: search
    }
  }
  changeTag = (e) => {
    this.setState({
      tag: e.target.innerText
    })
  }
  renderTags = () => {
    const { tag } = this.state
    return ['all'].concat(Array.from(uniqueTags)).map((name, i) => {
      let classes = styles.tag
      if ((!tag && name === 'all') || tag === name) {
        classes = `${styles.current} ${styles.tag}`
      }
      return (
        <span key={i} className={classes} onClick={this.changeTag}>
          {name}
        </span>
      )
    })
  }
  renderSidebar = () => {
    return (
      <div>
        <nav className={styles.links}>
          <Link to='/'>
            Back home
          </Link>
        </nav>
        <div className={styles.tagWrapper}>
          <h3>Browse by tag</h3>
          <div className={styles.tags}>
            { this.renderTags() }
          </div>
        </div>
      </div>
    )
  }
  render() {
    const { tag } = this.state
    const theTag = (tag !== 'all') ? tag : ''
    return (
      <Layout sidebar={this.renderSidebar()}>
        <div className={styles.wrapper}>
          <Helmet title={'Netlify Function Examples'} />
          <SEO />
          <div className={styles.content}>
            <div style={{ paddingBottom: 300 }}>
              <Grid
                data={data}
                tag={theTag}
                title={(count) => {
                  let countRender
                  if (count) {
                    countRender = (
                      <span className={styles.count}>
                        ({ count })
                      </span>
                    )
                  }
                  return (
                    <div className={styles.title}>
                      <h1>
                        Function Examples
                        {countRender}
                      </h1>
                      <div className={styles.actions}>
                        <Button to='/add-example' onClick={() => analytics.track('exampleAdditionStarted') }>
                          {'Add a function example'}
                        </Button>
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
