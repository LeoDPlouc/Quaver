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
        <div class="artistPresentationHeader">
            <cover-mosaic :artist="artist"></cover-mosaic>
            <div class="artistPresentationInfos">
                <div class="artistPresentationInfo">{{ artist.name }}</div>
            </div>
        </div>
        <album-list class="artistPresentationAlbumList" />
        <song-list
            class="artistPresentationSongList"
            @song-changed="$emit('song-changed', $event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Artist } from '../models'
import songList from "./song-list.vue"
import AlbumList from "./album-list.vue"
import { getArtist } from "../fetch"
import coverMosaicVue from "./cover-mosaic.vue"

export default defineComponent({
    components: { songList: songList, albumList: AlbumList, coverMosaic: coverMosaicVue },

    emits: ["song-changed"],

    async created() {
        this.artist = await getArtist(this.$route.params.id)
    },

    data() {
        return {
            artist: {} as Artist,
            isFetching: true
        }
    }
})

</script>

<style>
.artistPresentationHeader {
    display: grid;
    grid-template-columns: 15vw auto;
    margin-bottom: 10px;
}
.artistPresentationInfos {
    margin-left: 10px;
}
.artistPresentationAlbumList {
    height: calc(10vw + 10em);
    overflow-y: auto;
    overflow-x: hidden;
}
.artistPresentationSongList {
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>