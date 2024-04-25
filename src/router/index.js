import { createRouter, createWebHistory } from 'vue-router'
import DiccionarioTraductor from '../views/DiccionarioTraductor.vue' 
import AuthForm from '@/views/AuthForm.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: AuthForm
    },
    
  {
    path: '/home',
    name: 'home',
    component: DiccionarioTraductor
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
