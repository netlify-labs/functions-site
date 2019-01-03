import React from 'react'
import Helmet from 'react-helmet'
import config from '../../_site-config'
import styles from './Default.css'
import Sidebar from '../fragments/Sidebar'
import netlifyIdentity from 'netlify-identity-widget'
import './index.css'


// SSR wrap
if (typeof window !== 'undefined') {
  // You must run this once before trying to interact with the widget
  netlifyIdentity.init()
}

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
    const { children, sidebar } = this.props
    return (
      <div className={styles.test}>
        <Helmet>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <div className={styles.wrapper}>
          <Sidebar children={sidebar} />
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
