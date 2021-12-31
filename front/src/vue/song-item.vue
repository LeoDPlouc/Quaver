<template>
  <div class="songItem">
    <div class="songItemProp songItemLike">{{ song.like }}</div>
    <div class="songItemProp songItemN">{{ song.n }}</div>
    <div class="songItemProp songItemTitle" @click="songItemTitleClicked">{{ song.title }}</div>
    <div class="songItemProp songItemDuration">{{ formatDuration(song.duration) }}</div>
    <div class="songItemProp songItemArtist">{{ song.artist }}</div>
    <div class="songItemProp songItemAlbum">{{ song.album }}</div>
    <div class="songItemProp songItemYear">{{ song.year }}</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { Song } from "../models"
import { SongItemTitleClickedEventArgs } from "../eventArgs";

export default defineComponent({
  props: { song: Song, index: Number },

  emits: ["song-item-title-clicked"],

  methods: {
    formatDuration(duration: number): string {
      try {
        var seconds = Number(duration) % 60;
        var secondsString = String(seconds).split(".")[0];
        if (secondsString.length == 1) secondsString = secondsString + "0"
        if (secondsString.length == 0) secondsString = "00"
        var minutes = Number(duration) / 60;
        var minutesString = String(minutes).split(".")[0];
        if (minutesString.length == 0) minutesString = "0"
        return `${minutesString}:${secondsString}`;
      } catch (error) { }
      return String(duration);
    },
    songItemTitleClicked(e: MouseEvent) {
      this.$emit("song-item-title-clicked", new SongItemTitleClickedEventArgs(this.song, this.index))
    }
  },
})
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