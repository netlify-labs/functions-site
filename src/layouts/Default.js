import React from 'react'
import Helmet from 'react-helmet'
import config from '../../_site-config'
import styles from './Default.css'
import Sidebar from '../fragments/Sidebar'
import './index.css'

export default class MainLayout extends React.Component {
  render() {
    const { children, sidebar } = this.props
    return (
      <div className={styles.test}>
        <Helmet>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <div className={styles.wrapper}>
          <Sidebar children={sidebar} path={this.props.children._owner.key} />
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
