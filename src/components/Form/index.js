import React from 'react'
import AutoForm from './AutoForm'


function fixScroll(){
  // http://bit.ly/2gQ6jFJ
  this.scrollIntoView(false)
}

export default class Form extends React.Component {
  componentDidMount() {
    const list = this.node.querySelectorAll('input,select,textarea')
    for (var i = 0; i < list.length; i++) {
      list[i].addEventListener('invalid', fixScroll)
    }
  }
  componentWillUnmount() {
    const list = this.node.querySelectorAll('input,select,textarea')
    for (var i = 0; i < list.length; i++) {
      list[i].removeEventListener('invalid', fixScroll)
    }
  }

  handleSubmit = (event, data) => {
    const { onSubmit, id, onChange, trimOnSubmit, children } = this.props
    event.preventDefault()
    if (onSubmit) {
      onSubmit(event, data)
    }
  }

  render() {
    const { onSubmit, id, onChange, trimOnSubmit, children, name } = this.props
    return (
      <div ref={(node) => { this.node = node }}>
        <AutoForm name={name} id={id} trimOnSubmit={trimOnSubmit} onChange={onChange} onSubmit={this.handleSubmit}>
          {children}
        </AutoForm>
      </div>
    )
  }
}
