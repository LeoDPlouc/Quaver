<template>
    <div>
        <song-item
            v-for="(song, index) in songs"
            :key="index"
            :song="song"
            :index="index"
            @song-item-title-clicked="songChanged"
        ></song-item>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SongChangedEventArgs, SongItemTitleClickedEventArgs } from "../eventArgs";
import { getAlbumSongs, getAllSongs, getArtistSongs } from "../fetch";
import { Song } from "../models";
import songItemVue from "./song-item.vue";

export default defineComponent({
    components: {
        "song-item": songItemVue
    },

    emits: ["song-changed"],

    async created() {
        if (this.$route.fullPath.match("/album/")) this.songs = await getAlbumSongs(this.$route.params.id)
        else if (this.$route.fullPath.match("/artist/")) this.songs = await getArtistSongs(this.$route.params.id)
        else this.songs = await getAllSongs()

    },
    data() {
        return {
            songs: [] as Song[]
        }
    },

    methods: {
        songChanged(e: SongItemTitleClickedEventArgs) {
            this.$emit("song-changed", new SongChangedEventArgs(e.song, e.index, this.songs))
        }
    }
})
</script>

<style>
</style>