import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 0,
  },
  children: [
    // {
    //   path: 'workplace',
    //   name: 'Workplace',
    //   component: () => import('@/views/dashboard/workplace/index.vue'),
    //   meta: {
    //     locale: 'menu.dashboard.workplace',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'public-dashboard',
      name: 'Public Dashboard',
      component: () => import('@/views/dashboard/publicDashboard/index.vue'),
      meta: {
        locale: 'menu.dashboard.publicDashboard',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'my-dashboard',
      name: 'My Dashboard',
      component: () => import('@/views/dashboard/myDashboard/index.vue'),
      meta: {
        locale: 'menu.dashboard.myDashboard',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // {
    //   path: 'monitor',
    //   name: 'Monitor',
    //   component: () => import('@/views/dashboard/monitor/index.vue'),
    //   meta: {
    //     locale: 'menu.dashboard.monitor',
    //     requiresAuth: true,
    //     roles: ['admin'],
    //   },
    // },
  ],
};

export default DASHBOARD;
