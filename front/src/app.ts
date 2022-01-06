import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"

import App from './vue/app.vue'
import SongList from './vue/song-list.vue'
import AlbumList from './vue/album-list.vue'
import ArtistList from './vue/artist-list.vue'
import AlbumPresentation from './vue/album-presentation.vue'
import ArtistPresentation from './vue/artist-presentation.vue'

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
