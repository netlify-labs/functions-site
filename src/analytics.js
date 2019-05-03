import Analytics from 'analytics'
import gtagManager from 'analytics-plugin-google-tag-manager'

const analytics = Analytics({
  plugins: [
    gtagManager({
      containerId: 'GTM-NMKKF2M'
    }),
    {
      NAMESPACE: 'test-plugin',
      page: () => {
        console.log('page view')
      }
    }
  ]
})

// Set to global so analytics plugin will work
window.Analytics = analytics

export default analytics
