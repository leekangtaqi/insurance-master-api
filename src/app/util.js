export default {
  values: function*(obj) {
    for (let key of Object.keys(obj)) {
      yield obj[key]
    }
  },
  pairs: function*(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]]
    }
  }
}