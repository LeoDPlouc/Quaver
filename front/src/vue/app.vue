<template>
    <song-list @song-changed="changeSong" />
    <player ref="player" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import songListVue from "./song-list.vue";
import playerVue from "./player.vue";
import { SongChangedEventArgs } from "../eventArgs";

export default defineComponent({
    components: {
        "song-list": songListVue,
        "player": playerVue
    },

    methods: {
        changeSong(e: SongChangedEventArgs) {
            this.$refs.player.loadSong(e.song)
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
</style>