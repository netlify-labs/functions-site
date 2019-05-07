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
        onKeyDown={props.onKeyDown}
        placeholder={props.placeholder}
      />
    </div>
  )
}

export default SearchBox
