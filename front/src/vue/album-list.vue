<template>
    <div class="albumList">
        <album-item v-for="(album, index) in albums" :key="index" :album="album" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAllAlbums } from "../fetch";
import { Album } from "../models";
import albumItemVue from "./album-item.vue";

export default defineComponent({
    components: {
        "album-item": albumItemVue
    },

    async created() {
        this.albums = await getAllAlbums()
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