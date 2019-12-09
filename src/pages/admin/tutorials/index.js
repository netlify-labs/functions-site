import React from 'react'
import { paramsParse } from 'analytics-utils'
import Base from '../../../layouts/Base'
import Form from '../../../components/Form'
import FieldSet from '../../../components/FieldSet'
import Input from '../../../components/Input'
import TextArea from '../../../components/TextArea'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Icon from '../../../components/Icon'
import CreatableSelect from 'react-select/lib/Creatable'
import { uniqueTags } from '../../../utils/data'
import styles from '../Admin.css'
import analytics from '../../../analytics'

const url = (typeof window !== 'undefined') ? `${window.location.origin}/admin/tutorials` : 'https://functions.netlify.com/admin/tutorials'
const width = 665
const height = 739
const functionName = 'NetlifyFunctions'
const param = (key, val) => `%26${key}%3D${val}`
const ampersand = '%26'
const questionMark = '%3F'
const bookmarklet = `javascript:(function()%7B${functionName}%3Dwindow.open("${url}%3Furl%3D"%2BencodeURIComponent(location.href)%2B"%26title%3D"%2B((document.title)%3Fescape(encodeURI(document.title)):"") %2B "%26api%3DIdbvF6muT9RZvJrFfL5urzCBxCxCoC","${functionName}","width%3D${width},height%3D${height},location,status,scrollbars,resizable,dependent%3Dyes")%3BsetTimeout("${functionName}.focus()",100)%3B%7D)()`

async function saveItem(item) {

  const payload = Object.keys(item).reduce((acc, thing) => {
    /* remove react-select fields */
    if (thing.match(/react-select/)) {
      return acc
    }
    acc[thing] = item[thing]
    return acc
  }, {})
  console.log('payload', payload)
  return fetch(`/.netlify/functions/add-tutorial/`, {
    method: 'POST',
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
      settingsOpen: false,
      loading: false,
      response: {}
    }
  }
  componentDidMount() {
    const params = paramsParse()
    if (params.url) {
      const url = (document.getElementsByName('url') || [{value: ''}])[0]
      url.value = params.url
    }
    if (params.title) {
      const title = (document.getElementsByName('title') || [{value: ''}])[0]
      title.value = decodeURI(params.title)
    }
    const date = (document.getElementsByName('date') || [{value: ''}])[0]
    date.valueAsDate = new Date()
  }
  handleSubmit = (e, data) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    // Ping API
    saveItem(data)
      .then((response) => {
        // {"message":"pr created!","url":"https://github.com/DavidWells/functions-site/pull/5"}
        console.log('track tutorialAdded')
        analytics.track('tutorialAdded', {
          url: url
        })
        console.log('response', response)
        this.setState({
          loading: false,
          response: response
        })
      }).catch((e) => {
        console.log('response err', e)
        analytics.track('tutorialAdditionFailed')
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
    const { settingsOpen, loading } = this.state

    const options = uniqueTags.map((item) => {
      return {
        value: item,
        label: item
      }
    })

    let handler = (!loading) ? this.handleSubmit : (e) => { e.preventDefault(); console.log('noop') }
    let button = (
      <Button>
        {'Add function tutorial'}
      </Button>
    )

    if (loading) {
      button = (
        <Button>
          {'Submitting...'}
        </Button>
      )
    }

    return (
      <div>
        <Modal showMenu={settingsOpen} handleModalClose={this.handleModalClose}>
          <h2>Settings</h2>
          <div>
            <a href={bookmarklet}>
              Drag this bookmarklet to your bookmarks bar for easier contributions
            </a>
          </div>
        </Modal>
        <Form name='what' onSubmit={handler}>
          <FieldSet className={styles.fieldSet}>
            <label htmlFor='name'>Title</label>
            <Input
              placeholder="Tutorial title"
              name='title'
              required
            />
          </FieldSet>
          <FieldSet className={styles.fieldSet}>
            <label htmlFor='url'>URL</label>
            <Input
              placeholder="https://link-to-the-tutorial.com/"
              name='url'
              validation='isURL'
              type='url'
              required
            />
          </FieldSet>
          <FieldSet className={styles.fieldSet}>
            <label htmlFor='date'>Date</label>
            <Input placeholder="Date" name='date' type='date' />
          </FieldSet>
          <FieldSet className={styles.fieldSet}>
            <label htmlFor='description'>Description</label>
            <TextArea
              placeholder='Add a brief desription of the tutorial'
              name="description"
            />
          </FieldSet>
          <div className={styles.submit}>
            {button}
          </div>
        </Form>
      </div>
    )
  }
  render() {
    const { response } = this.state
    // const response = {
    //   url: 'http://a.com'
    // }
    if (response.url) {
      return (
        <Base className={styles.adminWrapper}>
          <h1>
            You rock 🎉
          </h1>
          <p>
            Thanks for your submission!
          </p>
          <p>
            <a href={response.url} target='_blank' rel='noopener noreferrer'>
              {response.url}
            </a>
          </p>
        </Base>
      )
    }
    return (
      <Base className={styles.adminWrapper}>
        <h1>
          {'Add a function tutorial'}
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
