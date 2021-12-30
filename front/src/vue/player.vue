<template>
    <div class="playerButtons">
        <button>Previous</button>
        <button @click="play">Play</button>
        <button>Next</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Howl, Howler } from "howler"
import { Song } from "../models"

export default defineComponent({
    data() {
        return {
            player: new Howl({}),
            songIndex: 0,
            playList: []
        }
    },
    methods: {
        play(event: Event) {
            try {
                var player = this.player as Howl
                if (player.playing())
                    player.pause()
                else
                    player.play()
            }
            catch (e) {
                console.error(e)
            }
        },
        loadSong(song: Song, index: Number, playList: Song[]) {
            try {
                (this.player as Howl).unload()
            }
            catch (e) {
                console.error(e)
            }

            this.playList = playList
            this.index = index

            this.player = new Howl({ src: '/api/song/' + song.id + '/stream', html5: true, format: [song.format], onend: this.nextSong });
            (this.player as Howl).play()
        },
        nextSong() {
            this.index += 1
            this.loadSong(this.playList[this.index], this.index, this.playList)
        }
    }
})
</script>

<style>
.playerButtons {
    display: flex;
    flex-direction: row;
}
</style>