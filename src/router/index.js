import Vue from 'vue'
import VueRouter from 'vue-router'
import CadastroItem from "@/components/CadastroItem";
import Clientes from "@/components/Clientes";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Empenhos',
    component: CadastroItem
  },
  {
    path: '/',
    name: 'Itens',
    component: CadastroItem
  },
  {
    path: '/clientes',
    name: 'Cliente',
    component: Clientes
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
