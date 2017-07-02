'use strict'
const User = use('App/Model/User')
const Validator = use('Validator')
const Hash = use('Hash')

class UsersController {
  * register(request, response){
    if (request.method()==='GET') {
      yield response.sendView('users.register')
      return
    }

    const data=request.all()
    const validation=yield Validator.validate(data,User.rules);
    if (validation.fails()) {
      let msgs=validation.messages()
      let data=request.except('_csrf','password','confirm_password')
      yield response.sendView('users.register',{msgs:msgs, data:data})
      return
    }
    const user = new User(request.except('_csrf','confirm_password','password'))
    user.admin=false
    user.password = yield Hash.make(request.input('password'))
    yield user.save()
    response.redirect('/')
  }
}

module.exports = UsersController
