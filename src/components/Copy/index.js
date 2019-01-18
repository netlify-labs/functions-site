import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import styles from './Copy.css'

/* include non SSR compatible library */
const Clipboard = (typeof window !== 'undefined') ? require('clipboard') : null

const propTypes = {
  /** Text to copy */
  text: PropTypes.string,
  element: PropTypes.element,
  /** Component rendered that when clicked copies the text */
  children: PropTypes.any,
  /** Custom function to run on Copy */
  onCopy: PropTypes.func,
}

export default class Copy extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.clipboardInstance = null
  }
  componentDidMount() {
    const { onCopy, element } = this.props
    if (React.isValidElement(element)) {
      this.clipboardInstance = new Clipboard(this.copyElement, {
        text: () => element.props.value
      })
    } else {
      this.clipboardInstance = new Clipboard(this.copyElement)
    }
    this.clipboardInstance.on('success', (e) => {
      if (onCopy && typeof onCopy === 'function') {
        onCopy(e)
      }
      e.clearSelection()
    })

    this.clipboardInstance.on('error', (e) => {
      console.error('Action:', e.action)
      console.error('Trigger:', e.trigger)
    })
  }
  componentWillUnmount() {
    this.clipboardInstance.destroy()
  }
  render() {
    const { text, children, className } = this.props
    let copyText
    if (text) {
      copyText = text
    } else if (children && typeof children === 'string') {
      copyText = children
    }
    return (
      <span
        className={`${className} ${styles.copy}`}
        ref={(c) => { this.copyElement = c }}
        data-clipboard-text={copyText}
      >
        {children}
      </span>
    )
  }
}

Copy.propTypes = propTypes
