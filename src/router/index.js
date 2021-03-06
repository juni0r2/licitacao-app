import Vue from 'vue'
import VueRouter from 'vue-router'
import Item from "@/components/Item";
import Clientes from "@/components/Clientes";
import Empenho from "@/components/Empenho";
import ListaEmpenhos from "@/components/ListaEmpenhos";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Empenhos',
    component: Empenho
  },{
    path: '/listaEmpenhos',
    name: 'Lista Empenhos',
    component: ListaEmpenhos
  },
  {
    path: '/itens',
    name: 'Itens',
    component: Item
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
