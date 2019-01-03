import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../../layouts/Default'
import tutorials from '../../tutorials.json'

export default class Tutorials extends Component {
  renderTutorials = () => {
    return tutorials.map((tut, i) => {
      return (
        <div key={i}>
          <a href={tut.url}>{tut.title}</a>
        </div>
      )
    })
  }
  render() {
    return (
      <Layout>
        <div className="about-container" style={{ padding: 30 }}>
          <Helmet title={`Tutorials`} />
          <h2>
            Function Tutorials
          </h2>
          {this.renderTutorials()}
        </div>
      </Layout>
    )
  }
}
