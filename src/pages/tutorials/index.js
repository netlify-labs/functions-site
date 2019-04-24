import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../../layouts/Default'
import Grid from '../../fragments/Grid'
import tutorials from '../../data/tutorials.json'
import styles from './Tutorials.css'

export default class Tutorials extends Component {
  renderTutorials = () => {
    return tutorials.map((tut, i) => {
      return (
        <a key={i} className={styles.link} href={tut.url} target='_blank' rel='noopener noreferrer'>
          <span className={styles.tutorial}>
            <div className={styles.title}>
              {tut.title}
            </div>
            <div className={styles.description}>
              {tut.description}
            </div>
          </span>
          <span className={styles.date}>
            {tut.date}
          </span>
        </a>
      )
    })
  }
  render() {
    // For future searchable grid view
    const renderGrid = (
      <Grid
        data={tutorials}
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
                Function Tutorials
                {countRender}
              </h1>
            </div>
          )
        }}
      />
    )
    return (
      <Layout>
        <div style={{ padding: 30 }}>
          <Helmet title={`Tutorials`} />
          <h2>
            Function Tutorials
            <span className={styles.count}>
              ({ tutorials.length })
            </span>
          </h2>
          {this.renderTutorials()}
        </div>
      </Layout>
    )
  }
}
