import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.workspace',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    // {
    //   path: 'info',
    //   name: 'Info',
    //   component: () => import('@/views/user/info/index.vue'),
    //   meta: {
    //     locale: 'menu.workspace.info',
    //     roles: ['super_admin', 'team_admin'],
    //   },
    // },
    // {
    //   path: 'setting',
    //   name: 'Setting',
    //   component: () => import('@/views/user/setting/index.vue'),
    //   meta: {
    //     locale: 'menu.workspace.setting',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'follower',
      name: 'Follower',
      component: () => import('@/views/user/follower/index.vue'),
      meta: {
        locale: 'menu.workspace.follower',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'userList',
      name: 'UserList',
      component: () => import('@/views/user/user-list/index.vue'),
      meta: {
        locale: 'menu.workspace.userList',
        requiresAuth: true,
        roles: ['16'],
      },
    },

    {
      path: 'filter',
      name: 'Filter',
      component: () => import('@/views/user/filter/index.vue'),
      meta: {
        locale: 'menu.workspace.filter',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    {
      path: 'taskBoard',
      name: 'taskBoard',
      component: () => import('@/views/user/task-board/index.vue'),
      meta: {
        locale: 'menu.workspace.taskBoard',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // {
    //   path: 'ticket-stats',
    //   name: 'TicketStats',
    //   component: () => import('@/views/user/ticket-stats/index.vue'),
    //   meta: {
    //     locale: 'menu.workspace.ticketStats',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default USER;
