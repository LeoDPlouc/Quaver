<template>
  <div class="albumItem">
    <img
      class="cover"
      src="https://ia902305.us.archive.org/31/items/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1/mbid-af52ffd5-95ef-4621-b5b7-3b3ae3995cc1-30810216800_thumb250.jpg"
    />
    <div class="albumItemProp">{{ album.title }}</div>
    <div class="albumItemProp">{{ album.artist }}</div>
    <div class="albumItemProp">{{ album.year }}</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { Album } from "../models"

export default defineComponent({
  props: { album: Album }
})
</script>

<style>
.albumItem {
  border: 1px solid var(--misc);
  display: grid;
  grid-template-rows: 10vw 3em 2em 2em;
  width: 10vw;
  height: fit-content;
  margin-bottom: 10px;
}
.cover {
  height: 10vw;
}
.albumItemProp {
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>