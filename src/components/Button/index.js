import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../Icon'
import styles from './Button.css'

const propTypes = {
  /** Custom CSS Classes */
  className: PropTypes.string,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Text on the button */
  label: PropTypes.string,
  /** Element inside the button */
  children: PropTypes.any, // eslint-disable-line
  /** Determines the style of the button * */
  kind: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'danger']),
  /** Custom style prop */
  style: PropTypes.object,
  /** if href provided to button, button will be a link */
  href: PropTypes.string,
  /** target of href */
  target: PropTypes.string,
  /** name of icon */
  icon: PropTypes.string,
  /** Size of Icon. Takes number or pixel value. Example size={30} */
  iconSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
}

const defaultProps = {
  kind: 'primary',
  iconSize: 24
}

/**
 * Protip: Use `kind` prop to set styles of button
 */
export default function Button({
  onClick,
  label,
  children,
  className,
  kind,
  style,
  href,
  target,
  icon,
  iconSize,
  ...props
}) {
  const text = label || children

  const classes = classNames(
    'component-button',
    className,
    styles.button,
    styles[kind],
    {
      [styles.hasIcon]: icon
    }
  )

  let iconRender
  if (icon) {
    iconRender = (
      <Icon size={iconSize} className={styles.icon} name={icon} />
    )
  }
  // Make link if href supplied
  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        onClick={onClick}
        style={style}
      >
        {iconRender}
        <span className={styles.buttonText}>{text}</span>
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} style={style} {...props}>
      {iconRender}
      <span className={styles.buttonText}>
        {text}
      </span>
    </button>
  )
}

Button.propTypes = propTypes
Button.defaultProps = defaultProps
