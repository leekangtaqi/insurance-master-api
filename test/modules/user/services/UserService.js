import 'babel-polyfill'
import { expect } from 'chai';
import context, { load } from '../../../../src/app/context';

before(function(done){
  load(null, done)
})

describe('UserService', () => {
  it('#find', async () => {
    const { UserService } = context.services
    try {
      const users = await UserService().find()
      expect(users).to.have.lengthOf(3)
    } catch (e) {
      console.error(e)
      expect(e).to.equal(null)
    }
  })
})