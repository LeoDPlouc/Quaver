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
  <div v-show="search(queryString, song)" class="songItem">
    <div class="songItemProp songItemLike" @click="doLike">{{ song.like }}</div>
    <div class="songItemProp songItemN">{{ song.n }}</div>
    <div class="songItemProp songItemTitle" @click="songItemTitleClicked">
      {{ song.title }}
    </div>
    <div class="songItemProp songItemDuration">{{ formatDuration(song.duration) }}</div>
    <div class="songItemProp songItemArtist">{{ song.artist }}</div>
    <div class="songItemProp songItemAlbum">{{ song.album }}</div>
    <div class="songItemProp songItemYear">{{ song.year }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Song } from "../models";
import { SongItemTitleClickedEventArgs } from "../eventArgs";
import { search } from "../searching";
import { formatDuration } from "../util";
import { likeSong } from "../fetch";

export default defineComponent({
  props: { song: Song, index: Number },
  emits: ["song-item-title-clicked"],
  inject: ["query"],

  data() {
    return {
      queryString: this.query,
    };
  },

  methods: {
    search,
    formatDuration,
    songItemTitleClicked() {
      this.$emit(
        "song-item-title-clicked",
        new SongItemTitleClickedEventArgs(this.song, this.index)
      );
    },
    async doLike() {
      let like: number;

      switch (this.song.like) {
        case 1:
          like = -1;
          break;
        case 0:
          like = 1;
          break;
        case -1:
          like = 0;
          break;
      }

      likeSong(like, this.song.id).then((res) => {
        if (res.ok) {
          res.json().then((resJson) => {
            if (resJson.statusCode == 0) this.song.like = like;
          });
        }
      });
    },
  },
});
</script>

<style>
.songItem {
  border: 1px solid var(--misc);
  display: grid;
  grid-template-columns: 1em 2em auto 3em 20% 25% 3em;
}

.songItemProp {
  padding-left: 5px;
  padding-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.songItemLike {
  grid-column: 1;
}

.songItemN {
  grid-column: 2;
}

.songItemTitle {
  grid-column: 3;
}

.songItemDuration {
  grid-column: 4;
}

.songItemArtist {
  grid-column: 5;
}

.songItemAlbum {
  grid-column: 6;
}

.songItemYear {
  grid-column: 7;
}
</style>
