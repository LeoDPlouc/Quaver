import { Song } from "./models";

export class SongItemTitleClickedEventArgs {
    song: Song

    constructor(song: Song) {
        this.song = song
    }
}

export class SongChangedEventArgs {
    song: Song

    constructor(song: Song) {
        this.song = song
    }
}