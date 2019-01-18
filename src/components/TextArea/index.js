import React from 'react'
import classNames from 'classnames'
import Input from '../Input'
import styles from './TextArea.css'

/**
 * See Input component for full props
 */
const TextArea = ({className, ...other}) => {
  const classes = classNames(
    'component-textArea',
    styles.textArea,
    className
  )
  return (
    <Input {...other} className={classes} isTextArea />
  )
}

export default TextArea
