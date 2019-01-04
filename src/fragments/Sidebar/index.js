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

  return links.map((x, key) => {
    const classes = (path.replace(/\/$/, '') === x.url) ? styles.active : ''
    if (x.url.match((/^http/))) {
      return (
        <a href={x.url} target='_blank' rel='noopener noreferrer' key={key}>
          {x.text}
        </a>
      )
    }
    return (
      <Link to={x.url} className={classes} key={key}>
        {x.text}
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
