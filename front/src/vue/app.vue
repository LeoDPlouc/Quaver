<template>
    <div class="appContainer">
        <div class="appButtons">
            <router-link to="/song">Song</router-link>
            <router-link to="/album">Album</router-link>
            <router-link to="/artist">Artist</router-link>
        </div>
        <router-view class="view" @song-changed="changeSong"/>
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
}
.view {
    grid-row: 2;
    overflow: scroll;
}
.player {
    grid-row: 3;
}
</style>