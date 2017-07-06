import 'babel-polyfill'
import types from '../events-definition'
import Dispatcher from './dispatcher'
import InterfaceRegister from './interfaceRegister'

export default class Ctrip extends Dispatcher {
  constructor() {
    super()

    this.interfaces = new InterfaceRegister([
      {
        name: 'ctripWebTologin',
        ex: types.CTRIP_WEB_TOLOGIN,
        children: [
          {
            name: 'ctripWebLogin',
            ex: types.CTRIP_WEB_LOGIN
          }
        ]
      }
    ])
  }
}