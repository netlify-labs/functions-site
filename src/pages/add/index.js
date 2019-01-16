import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../../layouts/Default'
import Admin from '../admin'

export default class Tutorials extends Component {
  render() {
    return (
      <Layout>
        <div style={{ padding: 30 }}>
          <Helmet title={`Add an example`} />
          <Admin />
        </div>
      </Layout>
    )
  }
}
