import React from 'react'
import styles from './Sidebar.css'
import { Link } from 'gatsby'
import Logo from '../../components/Logo'

const defaultSidebar = () => {
  let path = ''
  if (typeof window !== 'undefined') {
    path = (window.location.pathname === '/') ? '//' : window.location.pathname
  }

  const links = [
    {
      url: '/',
      text: 'What are functions?'
    },
    {
      url: '/examples',
      text: 'Examples'
    },
    {
      url: '/tutorials',
      text: 'Tutorials'
    },
    {
      url: 'https://www.netlify.com/docs/functions/',
      text: 'Read the docs'
    }]

  return links.map((link, key) => {
    const { url, text } = link
    const classes = (path.replace(/\/$/, '') === url) ? styles.active : ''
    if (url.match((/^http/))) {
      return (
        <a href={url} target='_blank' rel='noopener noreferrer' key={key}>
          {text}
        </a>
      )
    }
    return (
      <Link to={url} className={classes} key={key}>
        {text}
      </Link>
    )
  })
}

const Sidebar = ({ children }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarFixed}>
        <div className={styles.sidebarInner}>
          <Link to='/'>
            <Logo />
          </Link>
          <nav className={styles.links}>
            {children || defaultSidebar()}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
