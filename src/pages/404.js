import React from "react"
import Layout from '../layouts/Default'
import { Link } from "gatsby"

export default class FourOhFour extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <h1>Page not found</h1>
        <p>
          Oops! The page you are looking for has been removed or relocated.
        </p>
        <Link to="/">
          <p>Go Back</p>
        </Link>
      </Layout>
    )
  }
}