    // Quaver is a self-hostable music player and music library manager
    // Copyright (C) 2022  DPlouc

    // This program is free software: you can redistribute it and/or modify
    // it under the terms of the GNU General Public License as published by
    // the Free Software Foundation, either version 3 of the License, or
    // (at your option) any later version.

    // This program is distributed in the hope that it will be useful,
    // but WITHOUT ANY WARRANTY; without even the implied warranty of
    // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    // GNU General Public License for more details.

    // You should have received a copy of the GNU General Public License
    // along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"

import App from './vue/app.vue'
import SongList from './vue/song-list.vue'
import AlbumList from './vue/album-list.vue'
import ArtistList from './vue/artist-list.vue'
import AlbumPresentation from './vue/album-presentation.vue'
import ArtistPresentation from './vue/artist-presentation.vue'

//Declare the routes
const routes = [
    { path: "/", component: SongList },
    { path: "/song", component: SongList },
    { path: "/album/:id", component: AlbumPresentation },
    { path: "/album", component: AlbumList },
    { path: "/artist/:id", component: ArtistPresentation },
    { path: "/artist", component: ArtistList }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount("#app")
