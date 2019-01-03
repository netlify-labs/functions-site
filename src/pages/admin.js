import React from "react"
import Form from '../components/Form'
import Input from '../components/Input'
import netlifyIdentity from 'netlify-identity-widget'
import styles from './Admin.css'

// Get JWT token of current user
function generateHeaders(user) {
  const headers = { 'Content-Type': 'application/json' }
  if (user) {
    return user.jwt().then((token) => {
      return { ...headers, Authorization: `Bearer ${token}` }
    })
  }
  return Promise.resolve(headers)
}

async function saveItem(item) {
  const user = netlifyIdentity.currentUser()
  const authHeaders = await generateHeaders(user)

  const payload = {
    ...item,
    userName: `${(user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : 'Anon'}`
  }
  console.log('payload', payload)
  return fetch(`/.netlify/functions/add-example/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(payload),
  }).then(response => {
    return response.json()
  })
}

export default class Admin extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loggedIn: false,
    }
  }
  componentDidMount() {
    netlifyIdentity.init()
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
  handleSubmit = (e, data) => {
    e.preventDefault()
    console.log(data)
    saveItem(data).then((response) => {

    }).catch((e) => {

    })
  }
  renderButton() {
    const user = netlifyIdentity.currentUser()
    console.log('user', user)
    if (!user) {
      return (
        <a href="#" onClick={ this.handleLogIn }>
          Sign up | Log in
        </a>
      )
    }
    return (
      <div>
        <div>
          <button onClick={this.handleLogOut}>
            Log out { user.email }
          </button>
        </div>
        <div>
          <Form name='what' onSubmit={this.handleSubmit}>
            <div className={styles.fieldSet}>
              <Input placeholder="Name" name='name' required />
            </div>
            <div className={styles.fieldSet}>
              <Input placeholder="Url" name='url' />
            </div>
            <div className={styles.fieldSet}>
              <Input placeholder="Code" name='code' />
            </div>
            <button onClick={saveItem}>
              save item
            </button>
          </Form>
        </div>
      </div>
    )
  }
  render() {
    console.log(this.state)
    return (
      <div className={styles.adminWrapper}>
        <h1>Admin</h1>
        {this.renderButton()}
      </div>
    )
  }
}
