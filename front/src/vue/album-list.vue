<template>
    <div class="albumList">
        <album-item v-for="(album, index) in albums" :key="index" :album="album" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAllAlbums, getArtistAlbums } from "../fetch";
import { Album } from "../models";
import albumItemVue from "./album-item.vue";

export default defineComponent({
    components: {
        "album-item": albumItemVue
    },

    async created() {
        if (this.$route.params.id) this.albums = await getArtistAlbums(this.$route.params.id)
        else this.albums = await getAllAlbums()
    },
    data() {
        return {
            albums: [] as Album[]
        }
    }
})
</script>

<style>
.albumList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>