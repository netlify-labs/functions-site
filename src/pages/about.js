import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../layouts/Default'
import config from '../../_site-config'

export default class AboutPage extends Component {
  render() {
    return (
      <Layout>
        <div className="about-container">
          <Helmet title={`About | ${config.siteTitle}`} />
          <p>
            hehehehehe
          </p>
        </div>
      </Layout>
    )
  }
}
