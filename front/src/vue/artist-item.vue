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
    v-show="search(queryString, artist)"
    class="artistItem"
    @click="openPresentation('/artist/' + artist.id)"
  >
    <cover-mosaic
      :artist="artist"
      :isFetching="false"
      :size="size"
    ></cover-mosaic>
    <div class="artistItemProp">{{ artist.name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getArtistAlbums } from "../fetch";
import { Album, Artist, ImageSize } from "../models";
import { search } from "../searching";
import { openPresentation } from "../util";
import coverMosaicVue from "./cover-mosaic.vue";

export default defineComponent({
  props: { artist: Artist },
  components: { coverMosaic: coverMosaicVue },
  inject: ["query"],

  methods: {
    openPresentation,
    search,
  },

  async created() {
    let albums = (await getArtistAlbums(this.artist.id)) as Album[];
    this.albumsCover = albums.map((a) => a.coverV2.id);
  },

  data() {
    return {
      albumsCover: [] as string[],
      queryString: this.query,
      size: ImageSize.small,
    };
  },
});
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
.artistItemProp {
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
</style>
