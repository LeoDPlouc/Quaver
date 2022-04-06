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
    <div v-if="!isFetching" class="coverContainer">
        <img loading="lazy" :class="getClass(0)" :src="getCoverURL(albumsCover[0])" />
        <img loading="lazy" :class="getClass(1)" :src="getCoverURL(albumsCover[1])" />
        <img loading="lazy" :class="getClass(2)" :src="getCoverURL(albumsCover[2])" />
        <img loading="lazy" :class="getClass(3)" :src="getCoverURL(albumsCover[3])" />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { getArtistAlbums, getCoverURL } from "../fetch";
import { Album, Artist } from "../models"

export default defineComponent({
    props: { artist: Artist },

    methods: {
        getCoverURL,
        getClass(pos: number) {
            var cls = "artistCover "

            if (this.albumsCover.length <= 1) {
                if (pos == 0) cls += "artistCoverLen1Pos1"
                else cls += "artistCoverNoDisplay"
            }

            if (this.albumsCover.length == 2) {
                if (pos == 0) cls += "artistCoverLen2Pos1"
                else if (pos == 1) cls += "artistCoverLen2Pos2"
                else cls += "artistCoverNoDisplay"
            }

            if (this.albumsCover.length == 3) {
                if (pos == 0) cls += "artistCoverLen3Pos1"
                else if (pos == 1) cls += "artistCoverLen3Pos2"
                else if (pos == 2) cls += "artistCoverLen3Pos3"
                else cls += "artistCoverNoDisplay"
            }

            if (this.albumsCover.length >= 4) {
                if (pos == 0) cls += "artistCoverLen4Pos1"
                else if (pos == 1) cls += "artistCoverLen4Pos2"
                else if (pos == 2) cls += "artistCoverLen4Pos3"
                else if (pos == 3) cls += "artistCoverLen4Pos4"
                else cls += "artistCoverNoDisplay"
            }

            return cls
        },
        async fetchAlbumCovers() {
            try {
                var albums = await getArtistAlbums(this.artist.id) as Album[]
                this.albumsCover = albums.map((a) => a.cover)
                this.isFetching = false
            } catch { }
        }
    },

    async created() {
        this.fetchAlbumCovers()
    },

    data() {
        return {
            albumsCover: [] as string[],
            isFetching: true
        }
    },

    watch: {
        artist(oldArtist, newArtist) {
            this.fetchAlbumCovers()
        }
    }
})
</script>

<style>
.artistCover {
    max-height: 100%;
    max-width: 100%;
    object-position: center;
}

.artistCoverLen1Pos1 {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
}

.artistCoverLen2Pos1 {
    grid-column: 1;
    grid-row: 1 / 3;
    max-height: 200%;
    max-width: 200%;
}
.artistCoverLen2Pos2 {
    grid-column: 2;
    grid-row: 1 / 3;
    max-height: 200%;
    max-width: 200%;
}

.artistCoverLen3Pos1 {
    grid-column: 1;
    grid-row: 1 / 3;
    max-height: 200%;
    max-width: 200%;
}
.artistCoverLen3Pos2 {
    grid-column: 2;
    grid-row: 1;
}
.artistCoverLen3Pos3 {
    grid-column: 2;
    grid-row: 2;
}

.artistCoverLen4Pos1 {
    grid-column: 1;
    grid-row: 1;
}
.artistCoverLen4Pos2 {
    grid-column: 2;
    grid-row: 1;
}
.artistCoverLen4Pos4 {
    grid-column: 2;
    grid-row: 1;
}
.artistCoverLen4Pos3 {
    grid-column: 2;
    grid-row: 2;
}

.artistCoverNoDisplay {
    display: none;
}

.coverContainer {
    display: grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 50% 50%;
    overflow: clip;
}
</style>