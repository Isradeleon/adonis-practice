'use strict'
const Album=use('App/Model/Album')
const Artist=use('App/Model/Artist')
const Song=use("App/Model/Song")
const Helpers=use("Helpers")
const Validator=use("Validator")
const Hash=use('Hash')

class SongsController {
  * newsong(request, response){
    const albums=yield Album.find()
    for (let i in albums) {
      let artist=yield Artist.findById(albums[i].artist_id)
      albums[i].artist=artist
    }
    if (request.method()==='GET') {
      yield response.sendView('songs.register',{albums:albums})
      return
    }
    const validation=yield Validator.validate(request.all(),Song.rules,{"album_id.required":"select an album"})
    if (validation.fails()) {
      let msgs=validation.messages()
      let data=request.only('name')
      yield response.sendView('songs.register',{albums:albums, msgs:msgs, data:data})
      return
    }
    const song = request.file('song', {
      maxSize:"10mb",
      allowedExtensions: ['mp3']
    })
    const hashedName=yield Hash.make(new Date().getTime()+"")
    const songName = `${hashedName}.${song.extension()}`
    const src=`/mp3/${songName}`
    yield song.move(`${Helpers.publicPath()}\\mp3\\`,songName)
    if (!song.moved()) {
      let data=request.only('name')
      yield response.sendView('songs.register',{albums:albums,msgs:[{message:"validation failed on the song file"}], data:data})
      return
    }
    let album=yield Album.findById(request.input('album_id'))
    let newsong=new Song()
    newsong.name=this.capitalize(request.input('name'))
    newsong.file=src
    newsong.album_id=album.id
    yield newsong.save()
    album.songs.push(newsong.id)
    yield album.save()
    response.redirect(`/artist/${album.artist_id}`)
  }

  capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
  }
}

module.exports = SongsController
