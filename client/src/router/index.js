import { createRouter, createWebHistory } from 'vue-router'
import { getSessionToken } from '../store/session.js'
import AuthView from '../views/AuthView.vue'
import SecretView from '../views/SecretView.vue'

const routes = [
  { path: '/', component: AuthView },
  {
    path: '/secret',
    component: SecretView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !getSessionToken()) {
    return '/'
  }
})

export default router
