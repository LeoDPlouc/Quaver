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
  <div>
    <div class="albumPresentationHeader">
      <img
        loading="lazy"
        class="albumPresentationCover"
        :src="getCoverURL(album.cover)"
      />
      <div class="albumPresentationInfos">
        <div class="albumPresentationInfo">{{ album.title }}</div>
        <div class="albumPresentationInfo">{{ album.artist }}</div>
        <div class="albumPresentationInfo">{{ album.year }}</div>
      </div>
    </div>
    <song-list
      class="albumPresentationSongList"
      @song-changed="$emit('song-changed', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAlbum } from "../fetch";
import { Album } from "../models";
import { getCoverURL } from "../util";
import songList from "./song-list.vue";

export default defineComponent({
  components: { songList },

  emits: ["song-changed"],

  async created() {
    this.album = await getAlbum(this.$route.params.id);
  },

  data() {
    return {
      album: {} as Album,
    };
  },

  methods: {
    getCoverURL,
  },
});
</script>

<style>
.albumPresentationHeader {
  display: grid;
  grid-template-columns: 15vw auto;
  margin-bottom: 10px;
}
.albumPresentationCover {
  width: 15vw;
}
.albumPresentationInfos {
  margin-left: 10px;
}
.albumPresentationSongList {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
