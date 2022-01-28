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
    <div class="playerButtons">
        <input
            class="progressBar"
            type="range"
            min="0"
            max="100"
            step="0.1"
            v-model="progress"
            @input="changeProgress"
        />
        <button class="prevButton" @click="previousSong">Previous</button>
        <button class="playButton" @click="play">Play</button>
        <button class="nextButton" @click="nextSong">Next</button>
        <input
            class="volumeSlider"
            type="range"
            min="0"
            max="100"
            v-model="volume"
            @input="changeVolume"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Howl, Howler } from "howler"
import { Song } from "../models"

export default defineComponent({
    mounted() {
        setInterval(() => {
            try {
                this.progress = 100 * (this.player as Howl).seek() / (this.player as Howl).duration()
            } catch { }
        })
    },
    data() {
        return {
            player: new Howl({}),
            index: 0,
            playList: [],
            volume: 75,
            progress: 0
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

            this.player = new Howl({ src: '/api/song/' + song.id + '/stream', html5: true, format: [song.format], onend: this.nextSong, volume: this.volume / 100 });
            (this.player as Howl).play()
        },
        nextSong() {
            this.index++
            this.loadSong(this.playList[this.index], this.index, this.playList)
        },
        previousSong() {
            this.index--
            this.loadSong(this.playList[this.index], this.index, this.playList)
        },
        changeVolume(e: Event) {
            (this.player as Howl).volume(this.volume / 100)
        },
        changeProgress(e: Event) {
            try {
                (this.player as Howl).seek((this.progress / 100) * (this.player as Howl).duration())
            }
            catch { }
        }
    }
})
</script>

<style>
.playerButtons {
    display: grid;
    grid-template-columns: 2fr 7fr 1fr 1fr 1fr 7fr 2fr;
    grid-template-rows: 10px auto;
}
.prevButton {
    grid-column: 3;
    grid-row: 2;
}
.playButton {
    grid-column: 4;
    grid-row: 2;
}
.nextButton {
    grid-column: 5;
    grid-row: 2;
}
.volumeSlider {
    grid-column: 7;
    grid-row: 2;
}
.progressBar {
    grid-column: 1/8;
    grid-row: 1;
}
</style>