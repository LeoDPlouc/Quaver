 <!-- Quaver is a self-hostable music player and music library manager
 Copyright (C) 2022  DPlouc

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>. -->

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

    props: { queryString: String },

    async created() {
        if (this.$route.fullPath.match("/album/")) this.songs = await getAlbumSongs(this.$route.params.id)
        else if (this.$route.fullPath.match("/artist/")) this.songs = await getArtistSongs(this.$route.params.id)
        else this.songs = await getAllSongs()

    },
    data() {
        return {
            songs: [] as Song[],
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