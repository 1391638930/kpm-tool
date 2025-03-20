import { DEFAULT_LAYOUT, REDIRECT_MAIN } from '../base';
import { AppRouteRecordRaw } from '../types';

const PROJECT: AppRouteRecordRaw = {
  path: '/project',
  name: 'project',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.project',
    requiresAuth: true,
    icon: 'icon-computer',
    order: 8,
  },
  children: [
    {
      path: 'board',
      name: 'board',
      component: () => import('@/views/project/board/index.vue'),
      meta: {
        locale: 'menu.project.board',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'tdr-data-analysis',
    //   name: 'TdrDataAnalysis',
    //   component: () => import('@/views/project/tdr-data-analysis/index.vue'),
    //   meta: {
    //     locale: 'menu.project.tdrDataAnalysis',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // {
    //   path: 'performance-analysis',
    //   name: 'PerformanceAnalysis',
    //   component: () => import('@/views/project/performance-analysis/index.vue'),
    //   meta: {
    //     locale: 'menu.project.performanceAnalysis',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default PROJECT;
