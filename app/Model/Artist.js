'use strict'

const mongoose=use('Mongoose')

let artistSchema=mongoose.Schema({
  name:String,
  date_birth:Date,
  image:String,
  albums:Array
})

let rules={
  name:"required",
  date_birth:"required|date"
}

module.exports=mongoose.model('Artist',artistSchema)
module.exports.rules=rules
