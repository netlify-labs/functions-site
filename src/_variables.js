/* Global CSS variables for use in CSS and JS */
const baseValue = 1
const unit = 'rem'
const baseFontSize = (baseValue * 1.6) + unit

function formatFont(modifier) {
  return (modifier * baseValue) + unit
}

module.exports = {
  primary: 'red',
  // -- Fonts
  fontSize: baseFontSize,
  fontSizeTiny: formatFont(1.2),
  fontSizeSmall: formatFont(1.4),
  fontSizeNormal: baseFontSize,
  fontSizeBig: formatFont(1.8),
  fontSizeH1: formatFont(3.0),
  fontSizeH2: formatFont(2.15),
  fontSizeH3: formatFont(1.7),
  fontSizeH4: formatFont(1.25),
  fontSizeH5: baseFontSize,
  fontSizeH6: formatFont(0.85),
}