'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/','HomeController.home')
Route.get('/artist/:id','ArtistsController.show')

Route.group('loginsignup',()=>{
  Route.route('/register',['POST','GET'],'UsersController.register')
  Route.route('/login',['POST','GET'],'LoginController.login')
}).middleware('loginsignup')

Route.group('authenticated',()=>{
  Route.get("/favorite/:song",'FavoritesController.add')
  Route.get("/remove/:favorite",'FavoritesController.remove')
  Route.get("/favorites",'FavoritesController.show')

  Route.route('/newartist',['GET','POST'],'ArtistsController.newartist').middleware('admin')
  Route.route('/newalbum',['GET','POST'],'AlbumsController.newalbum').middleware('admin')
  Route.route('/newsong',['GET','POST'],'SongsController.newsong').middleware('admin')

  Route.get('/logout',function * (request, response){
    yield request.auth.logout()
    response.redirect('/')
  })
}).middleware('authen')

Route.get('/test',function * (request, response){
  // const Artist=use("App/Model/Artist")
  // const ar=yield Artist.findOne({
  //   name:"The Shainsmokers"
  // })
  // ar.name="The Chainsmokers"
  // yield ar.save()
  response.send("Test!")
})

//admin generator
Route.get('/admin',function * (request, response){
  const User=use('App/Model/User')
  const admin=yield User.query()
  .where('email','hi_you@bro.com')
  .first()
  if (!admin) {
    const Hash=use('Hash')
    let user=new User()
    user.name='Isra'
    user.last_name='de Leon'
    user.email='hi_you@bro.com'
    user.admin=true
    user.password=yield Hash.make('1234')
    yield user.save()
  }
  response.redirect('/')
})
