import React from 'react'
import SearchBox from '../../components/SearchBox'
import Card from '../../components/Card'
import styles from './Grid.css'

export default class Grid extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      filterText: ''
    }
  }
  handleFilterInput = e => {
    this.setState({
      filterText: e.target.value
    })
  }
  renderTags(tags) {
    return (
      <div className={styles.itemTags}>
        {tags.join(', ')}
      </div>
    )
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
            <a to={example.code}>
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
        <div>
          <h2>
             No "{search}" examples found
          </h2>
          <div>
             Clear your search and try again
          </div>
        </div>
      )
    }

    return (
      <div style={{ marginBottom: 60 }}>
        <div className={styles.gridWrapper}>
          <div className={styles.gridContent}>
            <div style={{ marginBottom: 10 }}>
              <SearchBox
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
  if (!text) {
    return false
  }
  return text.toLowerCase().indexOf(search) > -1
}

function matchTags(search, tags) {
  if (!tags) {
    return false
  }
  return tags.some((tag) => {
    return tag.toLowerCase().indexOf(search) > -1
  })
}
