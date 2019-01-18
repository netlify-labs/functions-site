import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../../layouts/Default'
import styles from './Add.css'
import Admin from '../admin'

export default class Tutorials extends Component {
  render() {
    return (
      <Layout>
        <div className={styles.wrapper}>
          <Helmet title={`Add an example`} />
          <Admin />
        </div>
      </Layout>
    )
  }
}
