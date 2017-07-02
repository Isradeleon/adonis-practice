'use strict'

const mongoose=use('Mongoose')

let albumSchema=mongoose.Schema({
  name:String,
  date:Date,
  image:String,
  artist_id:String,
  songs:Array
})

let rules={
  name:"required",
  date:"required|date",
  artist_id:"required"
}

module.exports=mongoose.model('Album',albumSchema)
module.exports.rules=rules
