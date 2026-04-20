import { createRouter, createWebHistory } from 'vue-router'

import Movies from '../components/movies.vue'
import Musics from '../components/musics.vue'
import Pictures from '../components/pictures.vue'
import About from '../components/about.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/movies', component: Movies },
    { path: '/musics', component: Musics },
    { path: '/pictures', component: Pictures },
    { path: '/about', component: About },
    
  ],
})

export default router
