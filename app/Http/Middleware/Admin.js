'use strict'

class Admin {

  * handle (request, response, next) {
    const admin=request.currentUser.admin
    if (admin) {
      yield next
    }else{
      response.redirect('/')
    }
  }

}

module.exports = Admin
