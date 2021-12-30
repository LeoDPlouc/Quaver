<template>
    <div class="playerButtons">
        <button class="prevButton" @click="previousSong">Previous</button>
        <button class="playButton" @click="play">Play</button>
        <button class="nextButton" @click="nextSong">Next</button>
        <input class="volumeSlider" type="range" min="0" max="100" v-model="volume" @input="changeVolume" />
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
            playList: [],
            volume: 75
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

            this.player = new Howl({ src: '/api/song/' + song.id + '/stream', html5: true, format: [song.format], onend: this.nextSong, volume: this.volume });
            (this.player as Howl).play()
        },
        nextSong() {
            this.index += 1
            this.loadSong(this.playList[this.index], this.index, this.playList)
        },
        previousSong() {
            this.index -= 1
            this.loadSong(this.playList[this.index], this.index, this.playList)
        },
        changeVolume(e: Event) {
            (this.player as Howl).volume(this.volume / 100)
        }
    }
})
</script>

<style>
.playerButtons {
    display: grid;
    grid-template-columns: 2fr 7fr 1fr 1fr 1fr 7fr 2fr
}
.prevButton {
    grid-column: 3;
}
.playButton {
    grid-column: 4;
}
.nextButton {
    grid-column: 5;
}
.volumeSlider {
    grid-column: 7;
}
</style>