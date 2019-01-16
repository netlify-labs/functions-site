import React, { Component } from 'react'
import styles from './Modal.css' // eslint-disable-line

export default class Menu extends Component {
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleEscKey)
  }
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleEscKey)
  }
  handleEscKey = (e) => {
    const { showMenu, handleModalClose } = this.props
    if (showMenu && e.which === 27) {
      if (handleModalClose && typeof handleModalClose === 'function') {
        handleModalClose()
      }
    }
  }
  handleDelete = (e) => {
    const { handleClearCompleted } = this.props
    e.preventDefault()
    const deleteConfirm = window.confirm(
      'Are you sure you want to clear all completed todos?'
    )
    if (deleteConfirm) {
      handleClearCompleted()
    }
  }
  render() {
    const { showMenu, handleModalClose, children } = this.props
    if (!showMenu) {
      return null
    }
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <span
            className={styles.close}
            onClick={handleModalClose}
            role="img"
            aria-label='close'
          >
            ❌
          </span>
          {children}
        </div>
      </div>
    )
  }
}
