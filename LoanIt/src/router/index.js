import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BorrowView from '../views/BorrowView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/ausleihen', name: 'borrow', component: BorrowView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router