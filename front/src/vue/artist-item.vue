<template>
  <div class="artistItem" @click="openPresentation()">
    <img
      class="cover"
      src="https://ia902305.us.archive.org/31/items/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1-30810216800_thumb250.jpg"
    />
    <div class="artistItemProp">{{ artist.name }}</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { router } from "../app";
import { Artist } from "../models"

export default defineComponent({
  props: { artist: Artist },

  methods: {
    openPresentation() {
      router.push({ path: "/artist/" + this.artist.id })
    }
  }
})
</script>

<style>
.artistItem {
  border: 1px solid var(--misc);
  display: grid;
  grid-template-rows: 10vw 2em;
  width: 10vw;
  height: fit-content;
  margin-bottom: 10px;
}
.cover {
  height: 10vw;
}
.artistItemProp {
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
</style>