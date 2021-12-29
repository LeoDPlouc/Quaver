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
  props: { song: Song },

  emits: ["song-item-title-clicked"],

  methods: {
    formatDuration(duration: number): string {
      try {
        var seconds = Number(duration) % 60;
        var secondsString = String(seconds).split(".")[0];
        var minutes = Number(duration) / 60;
        var minutesString = String(minutes).split(".")[0];
        return `${minutesString}:${secondsString}`;
      } catch (error) { }
      return String(duration);
    },
    songItemTitleClicked(e: MouseEvent) {
      this.$emit("song-item-title-clicked", new SongItemTitleClickedEventArgs(this.song))
    }
  },
})
</script>

<style>
.songItem {
  border: 1px solid var(--misc);
  display: flex;
  flex-direction: row;
}

.songItemProp {
  padding-left: 5px;
  padding-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.songItemLike {
  width: 1%;
}

.songItemN {
  width: 2%;
}

.songItemTitle {
  width: 50%;
}

.songItemDuration {
  width: 2%;
}

.songItemArtist {
  width: 20%;
}

.songItemAlbum {
  width: 25%;
}

.songItemYear {
  width: 3%;
}
</style>