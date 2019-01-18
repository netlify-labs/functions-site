export default {
  isEmail: {
    pattern: /^([\w_\.\-\+])+@([\w\-]+\.)+([\w]{2,10})+$/, // eslint-disable-line
    message: 'Please enter a valid email address',
  },
  isPhone: {
    pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3,4})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
    message: 'Please enter a valid phone number'
  },
  isURL: {
    pattern: /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[:?\d]*)\S*$/, // eslint-disable-line
    message: 'Please enter a valid url'
  },
  isDomain: {
    pattern: /^[a-zA-Z0-9_-]+\.[.a-zA-Z0-9_-]+$/,
    message: 'Please enter a valid domain'
  },
  isZipCode: {
    pattern: /^\d{5}([ \-]?\d{4})?$/, // eslint-disable-line
  },
  isUserName: {
    pattern: /^[\w\-]{4,18}$/, // eslint-disable-line
    message: 'Username must be between 4 and 18 characters'
  },
  isFullName: {
    pattern: /(^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)\s([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)$/,
    message: 'Please enter your first and last name'
  }
  // future use https://github.com/jonschlinkert/is-git-url/blob/master/index.js
}
