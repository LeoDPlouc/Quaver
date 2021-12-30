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