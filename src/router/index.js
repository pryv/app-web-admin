/**
 * @license
 * Copyright (C) 2020–2024 Pryv S.A. https://pryv.com - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import AdminUsers from '../views/AdminUsers.vue';
import Config from '../views/Config.vue';
import Login from '../views/Login.vue';
import PlatformUsers from '../views/PlatformUsers.vue';
import { PermissionsService } from '@/services/permissions.service.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin-users',
    name: 'AdminUsers',
    component: AdminUsers,
    beforeEnter: (to, from, next) => {
      if (!PermissionsService.canReadAdminUsers()) {
        next(false);
      }
      next();
    }
  },
  {
    path: '/platform-users',
    name: 'PlatformUsers',
    component: PlatformUsers,
    beforeEnter: (to, from, next) => {
      if (!PermissionsService.canReadPlatformUsers()) {
        next(false);
      }
      next();
    }
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
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
