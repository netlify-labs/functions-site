import React from 'react'
import styles from './Input.css'

const Input = (props) => {
  return (
    <input
      {...props}
      className={styles.input}
      id={props.id}
      name={props.name}
      onChange={props.onChange}
      placeholder={props.placeholder}
      required={props.required}
    />
  )
}

export default Input
