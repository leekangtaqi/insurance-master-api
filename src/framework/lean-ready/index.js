const READY_STATUS = {
  IDLE: 0,
  PENDING: 1,
  READY: 2,
  EXECED: 3,
  ABORT: 4
}

function Ready() {
  this.$readyRef = {
    members: [],
    callbacks: [],
    readyStatus: READY_STATUS.IDLE
  }
}

Ready.prototype.add = function(serviceName) {
  this.$readyRef.readyStatus = READY_STATUS.PENDING
  let member = this.spawnMember(serviceName)
  this.$readyRef.members.push(member)
  return member
}

Ready.prototype.spawnMember = function(serviceName) {
  const callback = () => {
    let { members, readyStatus } = this.$readyRef
    callback.readyStatus = READY_STATUS.READY
    members[members.indexOf(callback)].readyStatus = READY_STATUS.READY
    this.$readyRef.readyStatus = 
      members.filter(m => m.readyStatus === READY_STATUS.READY).length === members.length ?
        READY_STATUS.READY : readyStatus
    this.ready()
    return this
  }
  callback.readyStatus = READY_STATUS.PENDING
  Object.defineProperty(callback, 'name', {
    writable: true
  });
  callback.name = serviceName
  return callback
}

Ready.prototype.ready = function(callback) {
  let { readyStatus, callbacks } = this.$readyRef
  let reset = true
  if (!callback) {
    callback = function noop() {}
    reset = false
  }
  callbacks.push(callback)
  if (readyStatus === READY_STATUS.READY || readyStatus === READY_STATUS.IDLE) {
    return this.flush(reset)
  }
}

Ready.prototype.flush = function(reset) {
  let { callbacks, readyStatus } = this.$readyRef
  callbacks.forEach(cb => cb())
  callbacks = []
  reset && (readyStatus = READY_STATUS.IDLE)
  return this
}

Ready.mixin = function(o) {
  let r = new Ready()
  for (let p in r){
    o[p] = r[p]
  }
}

module.exports = Ready