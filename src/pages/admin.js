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
    if (typeof window !== 'undefined') {
      netlifyIdentity.init()
    }
    const user = netlifyIdentity.currentUser()
    this.state = {
      loggedIn: user || false,
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
      window.location.href = window.location.href
    })
    netlifyIdentity.on('logout', () => {
      this.setState({ loggedIn: false })
      window.location.href = window.location.href
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
    console.log('send data', data)
    saveItem(data).then((response) => {
      console.log('response', response)
    }).catch((e) => {
      console.log('err', e)
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
            <button>
              save item
            </button>
          </Form>
        </div>
        <a href='javascript:(function()%7BThisLater%3Dwindow.open("https://functions.netlify.com/admin%3Furl%3D"%2BencodeURIComponent(location.href)%2B"%26title%3D"%2B((document.title)%3Fescape(encodeURI(document.title)):"") %2B "%26api%3DIdbvF6muT9RZvJrFfL5urzCBxCxCoC","ThisLater","width%3D800,height%3D540,location,status,scrollbars,resizable,dependent%3Dyes")%3BsetTimeout("ThisLater.focus()",100)%3B%7D)()'>bookmarklet</a>
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
