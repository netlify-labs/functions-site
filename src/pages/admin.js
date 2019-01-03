import React from "react"
import netlifyIdentity from 'netlify-identity-widget'

export default class Admin extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      loggedIn: false,
      token: null
    }
  }
  componentDidMount() {
    /* Register listeners on identity widget events */
    netlifyIdentity.on('login', () => {
      /* Close netlify identity modal on login */
      netlifyIdentity.close()
      /* Grab user data */
      const user = netlifyIdentity.currentUser()
      console.log('login complete', user)
      this.setState({
        loggedIn: false
      })

      // window.location.href = window.location.href
    })
    netlifyIdentity.on('logout', () => {
      this.setState({ loggedIn: false })
      // window.location.href = window.location.href
    })
  }
  handleLogIn = () => {
    netlifyIdentity.open()
  }
  handleLogOut = () => {
    netlifyIdentity.logout()
  }
  renderButton() {
    const user = netlifyIdentity.currentUser()
    if (!user) {
      return (
        <a href="#" onClick={ this.handleLogIn }>
          Sign up | Log in
        </a>
      )
    }
    return (
      <a href="#" onClick={this.handleLogOut}>
        Log out { user.email }
      </a>
    )
  }
  render() {
    return (
      <div>
        <h1>Admin</h1>
        {this.renderButton()}
      </div>
    )
  }
}
