<template>
    <div>
        <div class="albumPresentationHeader">
            <img
                class="albumPresentationCover"
                src="https://ia902305.us.archive.org/31/items/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1-30810216800_thumb250.jpg"
            />
            <div class="albumPresentationInfos">
                <div class="albumPresentationInfo">{{ album.title }}</div>
                <div class="albumPresentationInfo">{{ album.artist }}</div>
                <div class="albumPresentationInfo">{{ album.year }}</div>
            </div>
        </div>
        <song-list class="albumPresentationSongList" @song-changed="$emit('song-changed', $event)" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { getAlbum } from "../fetch"
import { Album } from '../models'
import songList from "./song-list.vue"

export default defineComponent({
    components: { songList },

    emits: ["song-changed"],

    async created() {
        this.album = await getAlbum(this.$route.params.id)
    },

    data() {
        return {
            album: {} as Album
        }
    }
})

</script>

<style>
.albumPresentationHeader {
    display: grid;
    grid-template-columns: 15vw auto;
    margin-bottom: 10px;
}
.albumPresentationCover {
    width: 15vw;
}
.albumPresentationInfos {
    margin-left: 10px;
}
.albumPresentationSongList {
    width: 100%;
}
</style>