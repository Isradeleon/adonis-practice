'use strict'

class LoginSignup {

  * handle (request, response, next) {
    const isLogged=yield request.auth.check()
    if (isLogged) {
      response.redirect('/')
      return
    }else{
      yield next
    }
  }

}

module.exports = LoginSignup
