
export default class InterfaceRegister {
  constructor(o) {
    this.data = {}
    this.init(o)
  }

  init(o, root) {
    if (!o || !Array.isArray(o)) {
      return
    }
    o.forEach(i => {
      i.parent = root
      this.data[i.name] = i
      i.children && this.init(i.children, i)
    })
  }

  getRoot(name) {
    if (!name) {
      return
    }
    if (!this.data[name] || !this.data[name].parent) {
      return this.data[name]
    }
    return this.getRoot(this.data[name].parent.name)
  }

  has(name) {
    return Object.keys(this.data || {}).indexOf(name) >= 0
  }
}