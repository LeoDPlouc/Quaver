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
    <div class="appContainer">
        <div class="appButtons">
            <router-link to="/">
                <img class="logo" src="/img/logo.svg" />
            </router-link>
            <router-link to="/song">Song</router-link>
            <router-link to="/album">Album</router-link>
            <router-link to="/artist">Artist</router-link>
        </div>
        <router-view class="view" @song-changed="changeSong" />
        <player class="player" ref="player" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import songListVue from "./song-list.vue";
import playerVue from "./player.vue";
import { SongChangedEventArgs } from "../eventArgs";
import albumListVue from "./album-list.vue";
import artistListVue from "./artist-list.vue";
import albumPresentationVue from "./album-presentation.vue";

export default defineComponent({
    components: {
        "song-list": songListVue,
        "album-list": albumListVue,
        "artist-list": artistListVue,
        "album-presentation": albumPresentationVue,
        "player": playerVue
    },

    methods: {
        changeSong(e: SongChangedEventArgs) {
            this.$refs.player.loadSong(e.song, e.index, e.playlist)
        }
    }
})
</script>

<style>
:root {
    --background: #14052e;
    --misc: #5514c8;
    --foreground: #8863c7;
}
body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--background);
    color: var(--foreground);
}
.appButtons {
    display: flex;
    flex-direction: row;
}
.appContainer {
    grid-row: 1;
    display: grid;
    grid-template-rows: 3em auto 5vh;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
.view {
    grid-row: 2;
    overflow: scroll;
}
.player {
    grid-row: 3;
}
.logo {
    height: 3em;
}
</style>