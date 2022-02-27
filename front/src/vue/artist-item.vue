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
  grid-template-rows: 10vw 3em;
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