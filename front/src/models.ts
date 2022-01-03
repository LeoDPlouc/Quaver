export class Song {
    id: string
    title: string
    n: number
    artist: string
    album: string
    year: number
    duration: number
    like: number
    albumId: string
    format: string

    constructor(id: string, title: string, n: number, artist: string, album: string, year: number, duration: number, like: number, albumId: string, format: string) {
        this.id = id
        this.title = title
        this.n = n
        this.artist = artist
        this.album = album
        this.year = year
        this.duration = duration
        this.like = like
        this.albumId = albumId
        this.format = format
    }
}

export class Album {
    id: string
    title: string
    artist: string
    artistId: string
    cover: string
    year: string

    constructor(id: string, title: string, artist: string, artistId: string, cover: string, year: string) {
        this.id = id
        this.title = title
        this.artist = artist
        this.artistId = artistId
        this.cover = cover
        this.year = year
    }
}

export class Artist {
    id: string
    name: string
    cover: string

    constructor(id: string, name: string, cover: string) {
        this.id = id
        this.name = name
        this.cover = cover
    }
}