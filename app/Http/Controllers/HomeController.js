'use strict'
const User = use('App/Model/User')
const Artist = use('App/Model/Artist')

class HomeController {
  * home (request,response){
    let artists=yield Artist.find()
    yield response.sendView('home',{artists:artists})
    return
  }
}

module.exports = HomeController
