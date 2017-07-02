'use strict'

const mongoose=use('Mongoose')

let songSchema=mongoose.Schema({
  name:String,
  file:String,
  album_id:String
})

let rules={
  name:"required",
  album_id:"required"
}

module.exports=mongoose.model('Song',songSchema)
module.exports.rules=rules
