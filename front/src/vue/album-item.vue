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
  <div v-show="search(queryString, album)" class="albumItem" @click="openPresentation()">
    <img loading="lazy" class="albumCover" :src="getCoverURL(album.cover)" />
    <div class="albumItemProp">{{ album.title }}</div>
    <div class="albumItemProp">{{ album.artist }}</div>
    <div class="albumItemProp">{{ album.year }}</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { router } from "../app";
import { Album } from "../models"
import { getCoverURL } from "../fetch";
import { search } from "../searching";

export default defineComponent({
  props: { album: Album },

  inject: ['query'],

  data() {
    return {
      queryString: this.query
    }
  },

  methods: {
    openPresentation() {
      router.push({ path: "/album/" + this.album.id })
    },
    getCoverURL,
    search
  }
})
</script>

<style>
.albumItem {
  border: 1px solid var(--misc);
  display: grid;
  grid-template-rows: 10vw 3em 3em 2em;
  width: 10vw;
  height: fit-content;
  margin-bottom: 10px;
}
.albumCover {
  max-height: 10vw;
  max-width: 10vw;
  object-fit: scale-down;
}
.albumItemProp {
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>