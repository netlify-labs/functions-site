import React from 'react'
import Helmet from 'react-helmet'
import config from '../../_site-config'
import styles from './Default.css'
import './index.css'

export default class MainLayout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div className={styles.test}>
        <Helmet>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        {children}
      </div>
    )
  }
}
