import React from 'react'
import Icon from '../../components/Icon'
import GitHubCorner from '../../components/GithubCorner'
import '../index.css'
import '../index.global.css'

export default class Base extends React.Component {
  componentDidMount () {
    Icon.loadSprite()
  }
  render() {
    const { children, className, noIcon } = this.props
    let corner
    if (noIcon) {
      corner = null
    } else {
      corner = <GitHubCorner url='https://github.com/netlify-labs/functions-site' />
    }
    return (
      <div className={className}>
        {corner}
        {children}
      </div>
    )
  }
}
