import { createRouter, createWebHistory } from 'vue-router'
import DiccionarioTraductor from '../views/DiccionarioTraductor.vue' 

const routes = [
  {
    path: '/',
    name: 'home',
    component: DiccionarioTraductor
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
