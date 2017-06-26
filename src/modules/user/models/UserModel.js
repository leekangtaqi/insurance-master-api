'use strict';
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: 'Username is required!!'
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