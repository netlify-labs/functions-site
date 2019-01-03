import React from 'react'
import Input from '../Input'
import styles from './SearchBox.css'

const SearchBox = (props) => {
  return (
    <div className={styles.searchBox}>
      <div className={styles.icon}></div>
      <Input
        id={props.id}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  )
}

export default SearchBox
