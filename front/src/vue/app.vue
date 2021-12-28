<template>
    <song-list></song-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import songListVue from "./song-list.vue";

export default defineComponent({
    components : {
        "song-list" : songListVue
    }
})
</script>

<style>

    :root {
        --background: #14052e;
        --misc: #5514C8;
        --foreground: #8863c7;
    }

    body {
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
        background-color: var(--background);
        color: var(--foreground)
    }
</style>