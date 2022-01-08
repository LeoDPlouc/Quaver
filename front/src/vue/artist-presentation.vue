<template>
    <div>
        <div class="artistPresentationHeader">
            <img
                class="artistPresentationCover"
                src="https://ia902305.us.archive.org/31/items/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1-30810216800_thumb250.jpg"
            />
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
import { Album, Artist } from '../models'
import songList from "./song-list.vue"
import AlbumList from "./album-list.vue"
import { getArtist } from "../fetch"

export default defineComponent({
    components: { songList: songList, albumList: AlbumList, AlbumList },

    emits: ["song-changed"],

    async created() {
        this.artist = await getArtist(this.$route.params.id)
    },

    data() {
        return {
            artist: {} as Artist
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
.artistPresentationCover {
    width: 15vw;
}
.artistPresentationInfos {
    margin-left: 10px;
}
.artistPresentationAlbumList {
    height: calc(10vw + 9em);
    overflow: scroll;
}
.artistPresentationSongList {
    width: 100%;
}
</style>