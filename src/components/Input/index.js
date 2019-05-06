import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import formValidation from './utils/validation'
import Icon from '../Icon'
import Copy from '../Copy'
import styles from './Input.css'

const propTypes = {
  /** Custom CSS Classes */
  className: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Set type of HTML5 input */
  type: PropTypes.string,
  /** Set current value */
  value: PropTypes.string,
  /** visual styles */
  kind: PropTypes.oneOf(['default']),
  /** disable input field if true */
  isDisabled: PropTypes.bool,
  /** make field required */
  isRequired: PropTypes.bool,
  /** add icon into field */
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  /** Size of Icon. Takes number or pixel value. Example size={30} */
  iconSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /** Show copy icon: Enables or disables a copy helper icon next to the input */
  isCopyable: PropTypes.bool,
  /** field validation. Can be regex, function, or keyName from validation utils */
  validation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]),
  /** Custom Classname when input valid */
  validClassName: PropTypes.string,
  /** Custom Classname when input invalid */
  invalidClassName: PropTypes.string,
  /** Custom Error text */
  errorMessage: PropTypes.string,
  /** Custom Error text CSS class */
  errorMessageClassName: PropTypes.string,
  /** Run function onBlur */
  onBlur: PropTypes.func,
  /** Run function onChange */
  onChange: PropTypes.func,
  /** Run function onFocus */
  onFocus: PropTypes.func,
  /** Run function onKeyPress */
  onKeyPress: PropTypes.func,
  /** debounce validation timeout */
  debounce: PropTypes.number,
  /** Make textarea instead of input */
  isTextArea: PropTypes.bool,
  /** (dont use unless necessry) Set to use outside state and disable debounce */
  isControlled: PropTypes.bool,
}

const defaultProps = {
  isDisabled: false,
  isRequired: false,
  type: 'text',
  kind: 'default',
  debounce: 1000,
  iconSize: 25,
  isCopyable: false,
  validClassName: styles.valid,
  invalidClassName: styles.invalid
}

/**
 * See all `components/Input/utils/validation` for prebaked validation
 */
class Input extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isValid: this.doValidation(props.value).isValid,
      blurRanOnce: (props.value) ? true : false,
      // Timeout ID
      tid: void 0, // eslint-disable-line
    }
  }
  componentDidMount() {
    setTimeout(() => {
      // sometimes value is set via the DOM. This updates initial state
      if (this.textInput) {
        const value = this.textInput.value
        if (value) {
          const inputData = this.doValidation(value)
          this.setState({
            tid: void 0,  // eslint-disable-line
            isValid: inputData.isValid,
            errorMessage: inputData.errorMessage,
            value
          }, this.doVisibleValidation(inputData))
        }
      }
    }, 0)
  }
  shouldComponentUpdate(nextProps, nextState) {
    const keys = Object.keys(nextProps)
    const { value, isValid } = this.state

    // if value invalid, always update
    if (!isValid) {
      return true
    }

    // We only consider the search term from the state
    if (value !== nextState.value) {
      return true
    }
    // We render if anything in the properties changed
    // > Different number of properties
    if (keys.length !== Object.keys(this.props).length) {
      return true
    }

    // > Different properties
    const changed = keys.some(key => nextProps[key] !== this.props[key])

    if (changed) {
      return true
    }

    return false
  }
  componentWillUnmount() {
    const { tid } = this.state
    window.clearTimeout(tid)
  }
  doValidation(value) {
    const { validation, errorMessage } = this.props
    const defaultMessage = errorMessage || 'Invalid Value'
    // console.log('validation', validation)
    // console.log('do validation', value)
    // console.log('formValidation', formValidation)
    if (typeof validation === 'string' && formValidation[validation]) {
      // check pattern in validations formValidation obj
      return {
        value: value,
        isValid: formValidation[validation].pattern.test(value),
        errorMessage: formValidation[validation].message || defaultMessage
      }
    } else if (typeof validation === 'object' && validation.pattern) {
      // if validation object is used
      return {
        value: value,
        isValid: validation.pattern.test(value),
        errorMessage: validation.message || defaultMessage
      }
    } else if (validation instanceof RegExp) {
      // check regex passed in
      return {
        value: value,
        isValid: validation.test(value),
        errorMessage: errorMessage || defaultMessage
      }
    } else if (typeof validation === 'function') {
      // do custom function for validation
      return {
        value: value,
        isValid: validation(value),
        errorMessage: errorMessage || defaultMessage
      }
    }
    // default field is valid if no validation
    return {
      value: value,
      isValid: true,
      errorMessage: ''
    }
  }
  handleChange = (event) => {
    const { tid } = this.state
    const { debounce, isControlled, validation } = this.props

    // If has validation, apply debouncer
    let deboundTimeout = (validation) ? debounce : 0

    // If form values controlled by outside state ignore debounce
    if (isControlled) {
      deboundTimeout = 0
    }

    if (tid) {
      clearTimeout(tid)
    }

    this.setState({
      value: event.target.value,
      tid: setTimeout(this.emitDelayedChange, deboundTimeout),
    })
  }
  emitDelayedChange = () => {
    const { value } = this.state
    const { onChange } = this.props

    const inputData = this.doValidation(value)

    this.setState({
      tid: void 0,  // eslint-disable-line
      isValid: inputData.isValid,
      errorMessage: inputData.errorMessage
    }, this.doVisibleValidation(inputData))

    if (onChange) {
      // because debounce, fake event is passed back
      const fakeEvent = {}
      fakeEvent.target = this.textInput
      onChange(fakeEvent, value, inputData.isValid)
    }
  }
  doVisibleValidation(inputData) {
    const { validation, validClassName, invalidClassName } = this.props
    const { isValid, value } = inputData
    if (validation && !isValid) {
      // has validation and is not valid!
      if (this.textInput.value) {
        this.textInput.classList.remove(validClassName)
        this.textInput.classList.add(invalidClassName)
        // set fake blur so validation will show
        this.setFakeBlur()
        // show error message
        this.prompt()
      }
    } else if (validation && isValid) {
      // has validation and is valid!
      this.textInput.classList.remove(invalidClassName)
      this.textInput.classList.add(validClassName)
    }
    // If input is empty and the validation is bad, remove the valid class
    if (!value && !isValid) {
      this.textInput.classList.remove(validClassName)
    }
  }
  setFakeBlur = () => {
    this.setState({
      blurRanOnce: true
    })
  }
  handleFocus = (event) => {
    const { onFocus, readOnly } = this.props
    const { isValid } = this.state

    if (readOnly) {
      this.select()
    }

    // this.outlineInput()
    if (onFocus) {
      onFocus(event, event.target.value, isValid)
    }
  }
  prompt = (cb) => {
    const { value } = this.state
    const { onChange } = this.props

    const inputData = this.doValidation(value)

    this.setState({
      tid: void 0,  // eslint-disable-line
      isValid: inputData.isValid,
      errorMessage: inputData.errorMessage
    }, () => {
      if (cb) {
        cb(inputData)
      }
    })
  }
  handleClick = (event) => {
    const { onClick } = this.props
    if (onClick) {
      onClick(event)
    }
    if (this.textInput.value) {
      // make onClick 'trigger' a blur
      this.setFakeBlur()
    }
  }
  handleBlur = (event) => {
    const { onBlur, validClassName } = this.props
    const { isValid } = this.state
    if (onBlur) {
      onBlur(event, event.target.value, isValid)
    }

    if (event.target.value) {
      // only show if input has some value
      this.prompt((inputData) => {
        this.doVisibleValidation(inputData)
      })
    }

    if (!event.target.value) {
      this.textInput.classList.remove(validClassName)
    }
    // console.log('this.state.', this.state)
    // console.log('this.state.blurRanOnce', this.state.blurRanOnce)
    // console.log('event.target.value', event.target.value)
    // Set blur state to show validations
    if (!this.state.blurRanOnce && event.target.value) {
      // capture focus if input wrong
      this.setState({
        blurRanOnce: true
      }, this.captureFocusWhenInvalid())
    }
  }
  captureFocusWhenInvalid() {
    if (!this.state.isValid) {
      // not sure about this guy. Results in different form tabbing behavior
      // this.focus()
    }
  }
  showValidation() {
    const { isValid, errorMessage, blurRanOnce } = this.state
    const { errorMessageClassName } = this.props
    if (isValid) {
      return null
    } else if (blurRanOnce) {
      const classes = classNames(styles.validation, errorMessageClassName)
      return (
        <div className={classes} onClick={this.focus}>
          {errorMessage}
        </div>
      )
    }
  }
  select = () => {
    this.textInput.select()
  }
  blur = () => {
    this.textInput.blur()
  }
  focus = () => {
    this.textInput.focus()
  }
  render() {
    const {
      className,
      isDisabled,
      isRequired,
      validation, // eslint-disable-line
      invalidClassName, // eslint-disable-line
      validClassName, // eslint-disable-line
      errorMessage,
      errorMessageClassName, // eslint-disable-line
      debounce, // eslint-disable-line
      type,
      value,
      kind,
      icon,
      isTextArea,
      iconSize,
      isCopyable,
      ...others
    } = this.props

    const { isValid } = this.state
    const classes = classNames(
      className,
      styles.input,
      styles[kind],
      {
        [styles.hasIcon]: icon
      }
    )
    // console.log('isValid', isValid)
    // console.log('errorMessage', this.state.errorMessage)

    const props = {
      ...others,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      onClick: this.handleClick,
      ref: (input) => { this.textInput = input },
      role: 'input',
      name: others.name || others.id || others.ref || formatName(others.placeholder),
      disabled: isDisabled,
      required: isRequired,
      type,
      value,
      className: classes,
    }

    let iconRender
    if (icon) {
      iconRender = (
        <div className={styles.iconWrapper}>
          <Icon onClick={this.focus} className={styles.icon} name={icon} size={iconSize} />
        </div>
      )
    }

    let tag = <input {...props} />

    if (isTextArea) {
      tag = <textarea {...props} />
    }

    let copyElement
    if (isCopyable) {
      copyElement = (
        <Copy className={styles.copyIcon} element={tag}>
          <Icon name={'copylink'} size={24}/>
        </Copy>
      )
    }

    const wrapperClasses = classNames(
      styles.inputWrapper,
      styles[`wrapper${kind}`],
    )

    return (
      <div className={wrapperClasses}>
        {this.showValidation()}
        {iconRender}
        {tag}
        {copyElement}
      </div>
    )
  }
}

function formatName(name) {
  return name.replace(/\s|-/g, '_')
}

Input.propTypes = propTypes
Input.defaultProps = defaultProps

export default Input
