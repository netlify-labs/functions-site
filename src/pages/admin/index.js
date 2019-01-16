import React from 'react'
import { paramsParse } from 'analytics-utils'
import Base from '../../layouts/Base'
import Form from '../../components/Form'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import CreatableSelect from 'react-select/lib/Creatable'
import netlifyIdentity from 'netlify-identity-widget'
import { uniqueTags } from '../../utils/data'
import styles from './Admin.css'
import './Admin.global.css'

const url = (typeof window !== 'undefined') ? `${window.location.origin}/admin` : 'https://functions.netlify.com/admin'
const bookmarklet = `javascript:(function()%7BNetlifyFunctions%3Dwindow.open("${url}%3Furl%3D"%2BencodeURIComponent(location.href)%2B"%26title%3D"%2B((document.title)%3Fescape(encodeURI(document.title)):"") %2B "%26api%3DIdbvF6muT9RZvJrFfL5urzCBxCxCoC","NetlifyFunctions","width%3D800,height%3D540,location,status,scrollbars,resizable,dependent%3Dyes")%3BsetTimeout("NetlifyFunctions.focus()",100)%3B%7D)()`

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
  console.log('item', item)

  const cleanItem = Object.keys(item).reduce((acc, thing) => {
    if (thing.match(/react-select/)) {
      return acc
    }
    // Force tags to be array
    if (thing === 'tags') {
      const finalTag = (typeof item[thing] === 'string') ? [item[thing]] : item[thing]
      acc[thing] = finalTag
      return acc
    }
    acc[thing] = item[thing]
    return acc
  }, {})
  console.log('cleanItem', cleanItem)
  // return false
  // const payload = {
  //   ...item,
  //   userName: `${(user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : 'Anon'}`
  // }
  // console.log('payload', payload)
  return fetch(`/.netlify/functions/add-example/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(cleanItem),
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
      settingsOpen: false
    }
  }
  componentDidMount() {
    const params = paramsParse()

    Icon.loadSprite()
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

    if (params.url) {
      const url = (document.getElementsByName('url') || [{value: ''}])[0]
      url.value = params.url
    }
    if (params.title) {
      const title = (document.getElementsByName('name') || [{value: ''}])[0]
      title.value = decodeURI(params.title)
    }
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
  handleSettingsClick = () => {
    this.setState({
      settingsOpen: true
    })
  }
  handleModalClose = () => {
    this.setState({
      settingsOpen: false
    })
  }
  renderButton() {
    const { settingsOpen } = this.state
    const user = netlifyIdentity.currentUser()
    console.log('user', user)
    if (!user) {
      return (
        <a href="#" onClick={ this.handleLogIn }>
          Sign up | Log in
        </a>
      )
    }
    const options = uniqueTags.map((item) => {
      return {
        value: item,
        label: item
      }
    })
    return (
      <div>
        <div>
          <Modal showMenu={settingsOpen} handleModalClose={this.handleModalClose}>
            <h2>Settings</h2>
            <div>
              <a href={bookmarklet}>bookmarklet</a>
              <div>
                <button onClick={this.handleLogOut}>
                  Log out { user.email }
                </button>
              </div>
            </div>
          </Modal>
          <Form name='what' onSubmit={this.handleSubmit}>
            <div className={styles.fieldSet}>
              <Input placeholder="Example name" name='name' required />
            </div>
            <div className={styles.fieldSet}>
              <Input placeholder="Repo Url" name='url' type='url' />
            </div>
            <div className={styles.fieldSet}>
              <Input placeholder="Direct link to code" name='code' type='url' />
            </div>
            <div className={styles.fieldSet}>
              <CreatableSelect
                isMulti
                placeholder='(Optional) Choose or Create tags'
                name="tags"
                // defaultMenuIsOpen
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className={styles.submit}>
              <Button>
                {'Add function example'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
  render() {
    return (
      <Base className={styles.adminWrapper}>
        <h1>
          Add an example
          <Icon
            name='settings'
            size={28}
            fill='#808080'
            onClick={this.handleSettingsClick} />
        </h1>
        {this.renderButton()}
      </Base>
    )
  }
}
