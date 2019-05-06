import Analytics from 'analytics'
import segmentPlugin from 'analytics-plugin-segment'
import customerIoPlugin from 'analytics-plugin-customerio'
import gtagManagerPlugin from 'analytics-plugin-google-tag-manager'

const analytics = Analytics({
  plugins: [
    gtagManagerPlugin({
      containerId: 'GTM-NMKKF2M'
    }),
    segmentPlugin({
      writeKey: 'f3W8BZ0iCGrk1STIsMZV7JXfMGB7aMiW',
      disableAnonymousTraffic: true,
    }),
    customerIoPlugin({
      siteId: '4dfdba9c7f1a6d60f779'
    }),
    {
      NAMESPACE: 'test-plugin',
      page: (d) => {
        console.log('page view', d)
      }
    }
  ]
})

analytics.on('page', ({ payload }) => {
  console.log('page', payload)
})

analytics.on('track', ({ payload }) => {
  console.log('track', payload)
})

// Set to global so analytics plugin will work
if (typeof window !== 'undefined') {
  window.Analytics = analytics
}

export default analytics
