import Analytics from 'analytics'
import segmentPlugin from 'analytics-plugin-segment'
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
    {
      NAMESPACE: 'custom-analytics-plugin',
      page: ({ payload }) => {
        const { protocol, host, pathname } = window.location
        const { properties, meta, anonymousId, userId } = payload
        setTimeout(() => {
          const analyticsPayload = Object.assign({}, properties, {
            date: meta.timestamp || new Date().getTime(),
            title: properties.title || document.title,
            url: `${protocol}//${host}${pathname}`,
            anonymousId: anonymousId,
            userId: userId,
          })
          console.log('payload', analyticsPayload)
          if (window.location.origin === 'https://functions.netlify.com') {
            const endpoint = 'https://07z2fk5eb4.execute-api.us-west-2.amazonaws.com/prod/collect'
            fetch(endpoint, {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json'
              }),
              body: JSON.stringify(analyticsPayload)
            })
          }
        }, 0)
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
