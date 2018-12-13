const analytics = require('./src/analytics').default

exports.onRouteUpdate = ({ location }) => {
  console.log('new pathname', location.pathname)
  console.log('analytics', analytics)
}