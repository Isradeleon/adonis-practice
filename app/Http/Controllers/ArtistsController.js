'use strict'
const Artist=use('App/Model/Artist')
const Album=use('App/Model/Album')
const Song=use('App/Model/Song')
const Validator=use('Validator')
const Helpers = use('Helpers')
const Hash=use('Hash')

class ArtistsController {
  * show(request, response){
    const id=request.param('id')
    const artist=yield Artist.findById({
      _id:id
    })
    const albums=yield Album.where('_id').in(artist.albums)
    for (var i in albums) {
      let songs=yield Song.where('album_id').equals(albums[i].id)
      albums[i].songs=songs
      if (request.currentUser) {
        for (var j in songs) {
          let favs=yield request.currentUser.favorites().where('user_id',request.currentUser.id).where('song_id',songs[j].id)
          if (favs.length>0) {
            songs[j].isfav=true
          }else{
            songs[j].isfav=false
          }
        }
      }
    }
    yield response.sendView('artists.show',{artist:artist, albums:albums})
  }

  * newartist(request, response){
    if (request.method() === 'GET') {
      yield response.sendView('artists.register')
      return
    }

    const validation=yield Validator.validate(request.all(),Artist.rules)
    if (validation.fails()) {
      let msgs=validation.messages()
      let data=request.except('_csrf')
      yield response.sendView('artists.register',{msgs:msgs, data:data})
      return
    }
    const image = request.file('image', {
      maxSize:"10mb",
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    const hashedName=yield Hash.make(new Date().getTime()+"")
    const imageName = `${hashedName}.${image.extension()}`
    const src=`/img/artists/${imageName}`
    yield image.move(`${Helpers.publicPath()}\\img\\artists\\`,imageName)
    if (!image.moved()) {
      let data=request.except('_csrf')
      yield response.sendView('artists.register',{msgs:[{message:"validation failed on image"}], data:data})
      return
    }
    let artist=new Artist()
    artist.name=this.capitalize(request.input('name'))
    artist.date_birth=request.input('date_birth')
    artist.image=src
    artist.albums=[]
    yield artist.save()
    response.redirect('/')
  }

  capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
  }
}

module.exports = ArtistsController
