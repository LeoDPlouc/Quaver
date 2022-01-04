<template>
    <div class="albumList">
        <album-item v-for="(album, index) in albums" :key="index" :album="album" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SongChangedEventArgs, SongItemTitleClickedEventArgs } from "../eventArgs";
import { Album } from "../models";
import albumItemVue from "./album-item.vue";

export default defineComponent({
    components: {
        "album-item": albumItemVue
    },

    async created() {
        this.albums = await this.getAllAlbums()
    },
    data() {
        return {
            albums: []
        }
    },

    methods: {
        async getAllAlbums(): Promise<Album[]> {
            var res = await fetch("/api/album")
            var body = await res.json()
            var albums = body.data.albums as Album[]

            albums.sort((album1, album2) => {
                if (album1.title > album2.title)
                    return 1
                else return -1
            })
            return albums
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