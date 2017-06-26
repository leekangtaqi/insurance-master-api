import _ from 'lodash'

const idToObjKey = (id) => 'usr:o:id:' + id

class UserKv {
  constructor(context){
    this.context = context;
  }

  async loadById(id) {
    try {
      let redis = this.context.redis.main;
      let key = idToObjKey(id);
      return await redis.hgetallAsync(key)
    } catch (e) {
      this.context.logger.error(e)
      throw e
    }
  }

  async save(json) {
    try { 
      let redis = this.context.redis.main;
      let id = json.id;
      let key = idToObjKey(id);
      let fields = ['username']
      await redis.hmsetAsync(key, _.pick(json, ...fields))
    } catch (e) {
      this.context.logger.error(e)
      throw e
    }
  }
}

export default UserKv