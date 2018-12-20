import React from 'react'
import classnames from 'classnames'
import styles from './Card.css'

const Card = (props) => {
  const classes = classnames(props.className, styles.card)
  return (
    <div {...props} className={classes}>
      <div className={styles.cardInner}>
        {props.children}
      </div>
    </div>
  )
}

export default Card
