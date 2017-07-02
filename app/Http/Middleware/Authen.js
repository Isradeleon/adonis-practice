'use strict'

class Authen {

  * handle (request, response, next) {
    const isLogged=yield request.auth.check()
    if (isLogged) {
      yield next
    }else{
      response.redirect('/')
      return
    }
  }

}

module.exports = Authen
