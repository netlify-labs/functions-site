import React from 'react'
import styles from './Sidebar.css'
import { Link } from 'gatsby'
import Logo from '../../components/Logo'

const defaultSidebar = (
  <>
    <Link to='/'>
      What are functions?
    </Link>
    <Link to='examples'>
      Examples
    </Link>
    <a href='https://www.netlify.com/docs/functions/' target='_blank' rel='noopener noreferrer'>
      Read the docs
    </a>
  </>
)

const Sidebar = (props) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarFixed}>
        <div className={styles.sidebarInner}>
          <Link to='/'>
            <Logo />
          </Link>
          <nav className={styles.links}>
            {props.children || defaultSidebar}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
