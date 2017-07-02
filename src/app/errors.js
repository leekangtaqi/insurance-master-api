export class NoSuchUserError extends Error {
  constructor(code, message) {
    super()
    this.code = code || '801'
    this.message = message || 'no such user'
  }
}

export class NoOpenid extends Error {
  constructor(code, message) {
    super()
    this.code = code || '802'
    this.message = message || 'openid expected'
  }
}