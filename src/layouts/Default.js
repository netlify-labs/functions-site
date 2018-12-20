import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import config from '../../_site-config'
import Logo from '../components/Logo'
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
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarFixed}>
              <div className={styles.sidebarInner}>
                <Link to='/'>
                  <Logo />
                </Link>
                <br/>
                <a href='https://www.netlify.com/docs/functions/'>
                  Read the docs
                </a>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
