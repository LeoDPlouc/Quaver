<template>
    <div class="artistList">
        <artist-item v-for="(artist, index) in artists" :key="index" :artist="artist" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAllArtists } from "../fetch";
import { Artist } from "../models";
import artistItemVue from "./artist-item.vue";

export default defineComponent({
    components: {
        "artist-item": artistItemVue
    },

    async created() {
        this.artists = await getAllArtists()
    },

    data() {
        return {
            artists: [] as Artist[]
        }
    }
})
</script>

<style>
.artistList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>