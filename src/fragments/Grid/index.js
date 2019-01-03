import React from 'react'
import SearchBox from '../../components/SearchBox'
import Card from '../../components/Card'
import styles from './Grid.css'

const searchInputId = 'example-search'

export default class Grid extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      filterText: props.tag
    }
  }
  handleFilterInput = e => {
    this.setState({
      filterText: e.target.value
    })
  }
  setSearch = (value) => {
    this.setState({
      filterText: value
    })
    document.getElementById(searchInputId).value = value
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.tag !== this.props.tag) {
      this.setSearch(this.props.tag)
    }
  }
  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange()
    }
  }
  renderTags(tags) {
    return (
      <div className={styles.itemTags}>
        {tags.join(', ')}
      </div>
    )
  }
  renderTitle = (matchCount) => {
    const { title } = this.props
    if (title) {
      return (
        <div className={styles.gridTitle}>
          <h1>
            {title}
            <span className={styles.count}>({matchCount})</span>
          </h1>
        </div>
      )
    }
  }
  render() {
    const { data } = this.props
    const search = this.state.filterText
    let renderExamples = data.filter(example => {
      // No search query. Show all
      if (!search) {
        return true
      }

      const { name, description, tags } = example
      if (
        matchText(search, name) ||
        matchText(search, description) ||
        matchTags(search, tags)) {
        return true
      }
      // no match!
      return false
    }).map((example, i) => {
      return (
        <Card key={i} className={styles.item}>
          <div className={styles.itemTitle}>
            <a href={example.code} target='_blank' rel='noopener noreferrer'>
              {example.name}
            </a>
          </div>
          <div className={styles.itemDescription}>
            {example.description}
          </div>
          {example.tags && this.renderTags(example.tags)}
        </Card>
      )
    })

    if (!renderExamples.length) {
      renderExamples = (
        <div className={styles.noResults}>
          <h3>
            No "{search}" examples found. Clear your search and try again.
          </h3>
          <div>
            Checkout some popular queries:
            <ul>
              <li onClick={() => { this.setSearch('graphql') }}>graphql</li>
              <li onClick={() => { this.setSearch('database') }}>databases</li>
              <li onClick={() => { this.setSearch('auth') }}>authenication</li>
              <li onClick={() => { this.setSearch('ecommerce') }}>ecommerce</li>
              <li onClick={() => { this.setSearch('email') }}>email</li>
            </ul>
          </div>
        </div>
      )
    }

    return (
      <div style={{ marginBottom: 60 }}>
        {this.renderTitle(renderExamples.length)}
        <div className={styles.gridWrapper}>
          <div className={styles.gridContent}>
            <div style={{ marginBottom: 10 }}>
              <SearchBox
                id={searchInputId}
                placeholder='Search examples'
                onChange={this.handleFilterInput}
              />
            </div>
            <div className={styles.grid}>
              {renderExamples}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function matchText(search, text) {
  if (!text || !search) {
    return false
  }
  return text.toLowerCase().indexOf(search.toLowerCase()) > -1
}

function matchTags(search, tags) {
  if (!tags || !search) {
    return false
  }
  return tags.some((tag) => {
    return tag.toLowerCase().indexOf(search.toLowerCase()) > -1
  })
}
