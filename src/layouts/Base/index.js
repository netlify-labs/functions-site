import React from 'react'
import Icon from '../../components/Icon'
import GitHubCorner from '../../components/GitHubCorner'
import '../index.css'
import '../index.global.css'

export default class Base extends React.Component {
  componentDidMount () {
    Icon.loadSprite()
  }
  render() {
    const { children, className } = this.props
    return (
      <div className={className}>
        <GitHubCorner url='https://github.com/netlify-labs/functions-site' />
        {children}
      </div>
    )
  }
}
