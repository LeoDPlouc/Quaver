<template>
    <div class="artistList">
        <artist-item v-for="(artist, index) in artists" :key="index" :artist="artist" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Artist } from "../models";
import artistItemVue from "./artist-item.vue";

export default defineComponent({
    components: {
        "artist-item": artistItemVue
    },

    async created() {
        this.artists = await this.getAllArtists()
    },

    data() {
        return {
            artists: []
        }
    },

    methods: {
        async getAllArtists(): Promise<Artist[]> {
            var res = await fetch("/api/artist")
            var body = await res.json()
            var artists = body.data.artists as Artist[]

            artists.sort((artist1, artist2) => {
                if (artist1.name > artist2.name)
                    return 1
                else return -1
            })
            return artists
        }
    }
})
</script>

<style>
.artistList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>