import { Album, Song } from "./models";

export class SongItemTitleClickedEventArgs {
    song: Song
    index: Number

    constructor(song: Song, index: Number) {
        this.song = song
        this.index = index
    }
}

export class SongChangedEventArgs {
    song: Song
    index: Number
    playlist: Song[]

    constructor(song: Song, index: Number, playlist: Song[]) {
        this.song = song
        this.index = index
        this.playlist = playlist
    }
}