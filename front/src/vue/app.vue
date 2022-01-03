<template>
    <div class="appContainer">
        <!-- <song-list class="view" @song-changed="changeSong" /> -->
        <!-- <album-list class="view" /> -->
        <artist-list/>
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

export default defineComponent({
    components: {
        "song-list": songListVue,
        "album-list": albumListVue,
        "artist-list": artistListVue,
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
.appContainer {
    display: grid;
    grid-template-rows: 95vh 5vh;
}
.view {
    grid-row: 1;
    overflow: scroll;
}
.player {
    grid-row: 2;
}
</style>