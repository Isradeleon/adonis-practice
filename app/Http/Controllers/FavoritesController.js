'use strict'
const Favorite=use('App/Model/Favorite')
const Song=use('App/Model/Song')
const Album=use('App/Model/Album')
const Artist=use('App/Model/Artist')

class FavoritesController {
  * remove(request, response){
    const id=request.param("favorite")
    const favorite=yield Favorite.find(id)
    if (favorite) {
      yield favorite.delete()
    }
    response.json({result:true})
  }

  * show(request, response){
    const favs=yield request.currentUser.favorites().where('user_id',request.currentUser.id)
    let songs=[]
    for (var i in favs) {
      let song=yield Song.findById(favs[i].song_id)
      if (song) {
        song.fav_id=favs[i].id
        songs.push(song)
      }
    }
    for (var i in songs) {
      let album=yield Album.findById(songs[i].album_id)
      let artist=yield Artist.findById(album.artist_id)
      album.artist=artist
      songs[i].album=album
    }
    yield response.sendView('users.favorites',{songs:songs})
  }

  * add(request, response){
    const song=request.param("song")
    yield request.currentUser.favorites()
    .create({
      song_id:song
    })
    response.send({result:true})
  }
}

module.exports = FavoritesController
