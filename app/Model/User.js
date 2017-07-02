'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  static get rules(){
    return{
      name:'required',
      last_name:'required',
      email:'required|email|unique:users',
      password:'required',
      confirm_password:'required|same:password'
    }
  }

  favorites () {
    return this.hasMany('App/Model/Favorite','id','user_id')
  }

  static get createTimestamp () {
    return null
  }

  static get updateTimestamp () {
    return null
  }

  static get deleteTimestamp () {
    return null
  }
}

module.exports = User
