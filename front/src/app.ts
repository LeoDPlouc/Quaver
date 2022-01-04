import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"

import App from './vue/app.vue'
import SongList from './vue/song-list.vue'
import AlbumList from './vue/album-list.vue'
import ArtistList from './vue/artist-list.vue'

const routes = [
    { path: "/", component: SongList },
    { path: "/song", component: SongList },
    { path: "/album", component: AlbumList },
    { path: "/artist", component: ArtistList }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount("#app")