'use strict'
const Validator = use('Validator')

class LoginController {
  * login(request, response){
    const its=yield request.auth.check()
    if (its) {
      const current=request.currentUser
      response.json(current)
      return
    }
    if (request.method()==='GET') {
      yield response.sendView('users.login')
      return
    }

    let rules={
      email:'required|email',
      password:'required'
    }

    const data=request.all()
    const validation=yield Validator.validate(data,rules)
    if (validation.fails()) {
      let msgs=validation.messages()
      let data=request.except('_csrf','password')
      yield response.sendView('users.login',{msgs:msgs, data:data})
      return
    }

    try {
      yield request.auth.attempt(request.input('email'),request.input('password'))
      response.redirect('/')
      return
    } catch (e) {
      let data=request.except('_csrf','password')
      yield response.sendView('users.login',{msgs:[{message:e.message}],data:data})
      return
    }
  }
}

module.exports = LoginController
