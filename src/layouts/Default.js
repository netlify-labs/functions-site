import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import config from '../../_site-config'
import Logo from '../components/Logo'
import styles from './Default.css'
import './index.css'

function scrollTo (element) {
  if (typeof window !== 'undefined') {
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.offsetTop
    })
  }
}

export default class MainLayout extends React.Component {
  doScroll = () => {
    const element = document.getElementById('examples')
    scrollTo(element)
  }
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
                <nav className={styles.links}>
                  <a href='https://www.netlify.com/docs/functions/' target='_blank'>
                    Read the docs
                  </a>
                  <a onClick={this.doScroll}>
                    Examples
                  </a>
                </nav>
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
