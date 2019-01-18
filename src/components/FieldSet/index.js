import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './FieldSet.css'

const propTypes = {
  /** Custom CSS Classes */
  className: PropTypes.string,
  /** Alignment of label + input */
  align: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Style of  Label Container */
  labelStyle: PropTypes.object,
  /** Style of Input Container */
  inputStyle: PropTypes.object,
  children: PropTypes.any,
}

const defaultProps = {
  align: 'vertical'
}

/**
 * Used to group `Label` and `Input` components. Must have exactly 2 children
 */
const FieldSet = (props) => {
  const {
    children,
    className,
    align,
    labelStyle,
    inputStyle,
    ...other
  } = props
  const classes = classNames(
    'component-fieldSet',
    styles.fieldSet,
    className,
    styles[align]
    // propBasedClasses
  )

  if (!children || children.length !== 2) {
    throw new Error('FieldSet component must have exactly 2 children')
  }

  return (
    <div {...other} className={classes}>
      <div className={styles.labelWrapper} style={labelStyle}>
        {children[0]}
      </div>
      <div className={styles.inputWrapper} style={inputStyle}>
        {children[1]}
      </div>
    </div>
  )
}

FieldSet.propTypes = propTypes
FieldSet.defaultProps = defaultProps

export default FieldSet
