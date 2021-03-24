import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/channels'
  },
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
    },
    beforeEnter: (to, from, next) => {
      Vue.prototype.$mtproto.call('users.getFullUser', {
        id: {
          _: 'inputUserSelf'
        }
      }).then(() => {
        next();
      }).catch(() => {
        next('/login');
      });
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
