'use strict'

const Lucid = use('Lucid')

class Favorite extends Lucid {
  user () {
    return this.belongsTo('App/Model/User','id','user_id')
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

module.exports = Favorite
