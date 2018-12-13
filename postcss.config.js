// Hot reloading variables
module.exports = (config, hotLoadedVariables) => [
  require('postcss-cssnext')({ browsers: 'last 2 versions' }),
  require('postcss-simple-vars')({
    variables: function variables() {
      return hotLoadedVariables
    },
    onVariables(variables) {
      // console.log(variables)
    },
    unknown: function unknown(node, name, result) {
      node.warn(result, `Unknown variable ${name}`)
    }
  }),
  require('postcss-nested'),
  require('cssnano')()
]