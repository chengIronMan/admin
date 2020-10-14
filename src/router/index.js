import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/users.vue'
import hello from '@/components/hello.vue'
import categories from '@/components/categories.vue'
import goods from '@/components/goods.vue'
import orders from '@/components/orders.vue'
import params from '@/components/params.vue'
import reports from '@/components/reports.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    children:[
      {
        path: '/',
        name: 'hello',
        component: hello,
      },
      {
        path: '/users',
        name: 'users',
        component: users,
      },
      {
        path: '/categories',
        name: 'categories',
        component: categories,
      },
      {
        path: '/goods',
        name: 'goods',
        component: goods,
      },
      {
        path: '/orders',
        name: 'orders',
        component: orders,
      },
      {
        path: '/params',
        name: 'params',
        component: params,
      },
      {
        path: '/reports',
        name: 'reports',
        component: reports,
      },
      {
        path: '/rights',
        name: 'rights',
        component: rights,
      },
      {
        path: '/roles',
        name: 'roles',
        component: roles,
      }
    ],
    beforeEnter(to,from,next){
      if(sessionStorage.getItem('token')){
        next()
      }else{
        next('/')
      }
    }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
