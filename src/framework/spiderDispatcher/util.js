module.exports = {
  toCamel: function(str) {
    return str.split('-').map((p, i) => {
      if (i === 0) {
        return p
      }
      return p[0].toUpperCase() + p.slice(1)
    }).join('')
  },

  isPromise: function(o) {
    return o && o.then && typeof o.then === 'function'
  }
}