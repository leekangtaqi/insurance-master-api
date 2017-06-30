'use strict';
import mongoose, { Schema } from 'mongoose'
    
const UserSchema = new Schema({
  telephone: {
    type: String
  },
  openid: {
    type: String
  },
  unionid: {
    type: String
  },
  nickName: {
    type: String
  },
  headImgUrl: {
    type: String
  },
  gender: {
    type: String
  },
  city: {
    type: String
  },
  province: {
    type: String
  },
  country: {
    type: String
  },
  avatarUrl: {
    type: String
  },
  watermark: {
    "appid": {
      type: String
    },
    "timestamp": {
      type: String
    }
  }
},{
  timestamps:true
})

UserSchema.set('toObject', {
  getters: true,
  virtuals: true,
  transform: function(doc, ret, options) {
    options.hide = options.hide || '_id __v createdAt updatedAt'
    if (options.hide) {
      options.hide.split(' ').forEach(function (prop) {
        delete ret[prop];
      })
    }
  }
})

export default mongoose.model('User', UserSchema)