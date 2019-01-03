import React from 'react'
import classnames from 'classnames'
import styles from './Button.css'

const Button = (props) => {
  const classes = classnames(props.className, styles.button)
  return (
    <button {...props} className={classes}>
      {props.children}
    </button>
  )
}

export default Button
