/* global Analytics */

exports.onRouteUpdate = function({ location }, options) {
  if (typeof Analytics !== 'undefined') {
    // On every route change fire this
    Analytics.page()
  }
}
