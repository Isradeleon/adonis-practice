'use strict'
const Album=use('App/Model/Album')
const Artist=use('App/Model/Artist')
const Validator=use('Validator')
const Helpers=use('Helpers')
const Hash=use('Hash')

class AlbumsController {
  * newalbum(request, response){
    const artists=yield Artist.find()
    if (request.method()==='GET') {
      yield response.sendView('albums.register',{artists:artists})
      return
    }
    const validation=yield Validator.validate(request.all(),Album.rules,{"artist_id.required":"select an artist"})
    if (validation.fails()) {
      let msgs=validation.messages()
      let data=request.except('_csrf')
      yield response.sendView('albums.register',{artists:artists, msgs:msgs, data:data})
      return
    }
    const image = request.file('image', {
      maxSize:"10mb",
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    const hashedName=yield Hash.make(new Date().getTime()+"")
    const imageName = `${hashedName}.${image.extension()}`
    const src=`/img/albums/${imageName}`
    yield image.move(`${Helpers.publicPath()}\\img\\albums\\`,imageName)
    if (!image.moved()) {
      let data=request.except('_csrf')
      yield response.sendView('albums.register',{artists:artists,msgs:[{message:"validation failed on image"}], data:data})
      return
    }
    let artist=yield Artist.findById(request.input('artist_id'))
    let album=new Album()
    album.name=this.capitalize(request.input('name'))
    album.date=request.input('date')
    album.image=src
    album.artist_id=artist.id
    album.songs=[]
    yield album.save()
    artist.albums.push(album.id)
    yield artist.save()
    response.redirect(`/artist/${artist.id}`)
  }

  capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
  }
}

module.exports = AlbumsController
