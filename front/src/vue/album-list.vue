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

    props: { queryString: String },

    async created() {
        if (this.$route.params.id) this.albums = await getArtistAlbums(this.$route.params.id)
        else this.albums = await getAllAlbums()
    },

    data() {
        return {
            albums: [] as Album[],
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