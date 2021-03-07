import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: function() {
      return import('../views/Login.vue')
    }
  },
  {
    path: '/channels',
    name: 'Channels',
    component: function() {
      return import('../views/Channels.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
