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
  <div
    v-show="search(queryString, album)"
    class="albumItem"
    @click="openPresentation('/album/' + album.id)"
  >
    <cover class="albumCover" :cover-id="album.cover" :size="size" />
    <div class="albumItemProp">{{ album.title }}</div>
    <div class="albumItemProp">{{ album.artist }}</div>
    <div class="albumItemProp">{{ album.year }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Album } from "../models";
import { search } from "../searching";
import { getCoverURL, openPresentation } from "../util";
import { ImageSize } from "../models";
import coverVue from "./cover.vue";

export default defineComponent({
  components: { cover: coverVue },

  props: { album: Album },

  inject: ["query"],

  data() {
    return {
      queryString: this.query,
      size: ImageSize.small,
    };
  },

  methods: {
    openPresentation,
    getCoverURL,
    search,
  },
});
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
  height: 10vw;
  width: 10vw;
}

.albumItemProp {
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
