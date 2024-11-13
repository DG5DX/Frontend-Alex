import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Login from '../views/Login.vue';
import Articulos from '../views/Articulos.vue';

const routes = [
  {
    path: '/',
    name: 'app',
    component: App,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: Articulos,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' }); 
  } else {
    next();
  }
});

export default router;
