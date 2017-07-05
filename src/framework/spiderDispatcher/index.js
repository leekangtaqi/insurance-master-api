import types from './events-definition'
import CtripDispatcher from './dispatchers/ctrip'

let dispatcher = new CtripDispatcher()

dispatcher.register(types.CTRIP_SPIDE_REQUEST_INIT)

export default dispatcher
