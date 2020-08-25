import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import UsersManagement from '../views/UsersManagement.vue';
import Config from '../views/Config.vue';
import Login from '../views/Login.vue';
import PlatformUsersManagement from '../views/PlatformUsersManagement.vue';
import { PermissionsService } from '@/services/permissions.service.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/users-management',
    name: 'UsersManagement',
    component: UsersManagement,
    beforeEnter: (to, from, next) => {
      if (!PermissionsService.canReadUsers()) {
        next(false);
      }
      next();
    },
  },
  {
    path: '/platform-users-management',
    name: 'PlatformUsersManagement',
    component: PlatformUsersManagement,
    beforeEnter: (to, from, next) => {
      if (!PermissionsService.canReadPlatformUsers()) {
        next(false);
      }
      next();
    },
  },
  {
    path: '/platform-config',
    name: 'Config',
    component: Config,
    beforeEnter: (to, from, next) => {
      if (!PermissionsService.canReadSettings()) {
        next(false);
      }
      next();
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
