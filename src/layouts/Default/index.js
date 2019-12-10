import React from 'react'
import Helmet from 'react-helmet'
import config from '../../../_site-config'
import styles from './Default.css'
import Base from '../Base'
import Sidebar from '../../fragments/Sidebar'

export default class MainLayout extends React.Component {
  render() {
    const { children, sidebar, noIcon } = this.props
    return (
      <Base className={styles.test} noIcon={noIcon}>
        <Helmet>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <div className={styles.wrapper}>
          <Sidebar children={sidebar} />
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </Base>
    )
  }
}
