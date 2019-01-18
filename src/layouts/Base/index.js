import React from 'react'
import Icon from '../../components/Icon'
import '../index.css'

export default class Base extends React.Component {
  componentDidMount () {
    console.log('MOUNTED')
    Icon.loadSprite()
  }
  render() {
    const { children, className } = this.props
    return (
      <div className={className}>
        {children}
      </div>
    )
  }
}
