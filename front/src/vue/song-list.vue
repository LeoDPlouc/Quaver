<template>
    <div>
        <div v-for="(song, index) in songs" :key="index">
            <song-item :song="song" :index="index" @song-item-title-clicked="songChanged"></song-item>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SongChangedEventArgs, SongItemTitleClickedEventArgs } from "../eventArgs";
import { Song } from "../models";
import songItemVue from "./song-item.vue";

export default defineComponent({
    components: {
        "song-item": songItemVue
    },

    emits: ["song-changed"],

    async created() {
        this.songs = await this.getAllSongs()
    },
    data() {
        return {
            songs: []
        }
    },

    methods: {
        async getAllSongs(): Promise<Song[]> {
            var res = await fetch("/api/song")
            var body = await res.json()
            var songs = body.data.songs as Song[]

            songs.sort((song1, song2) => {
                if (song1.artist > song2.artist)
                    return 1
                else if (song1.artist == song2.artist) {
                    if (song1.album > song2.album)
                        return 1
                    else if (song1.album == song2.album) {
                        if (song1.n > song2.n)
                            return 1
                        else
                            return -1
                    }
                    else
                        return -1
                }
                else
                    return -1
            })
            return songs
        },
        songChanged(e: SongItemTitleClickedEventArgs) {
            this.$emit("song-changed", new SongChangedEventArgs(e.song, e.index, this.songs))
        }
    }
})
</script>

<style>
</style>