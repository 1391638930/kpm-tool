import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/list',
  name: 'list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.list',
    requiresAuth: true,
    icon: 'icon-list',
    order: 1,
  },
  children: [
    {
      path: 'kpm-list', // The midline path complies with SEO specifications
      name: 'KpmList',
      component: () => import('@/views/list/kpm-list/index.vue'),
      meta: {
        locale: 'menu.list.kpmList',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'verification-list', // The midline path complies with SEO specifications
      name: 'VerificationList',
      component: () => import('@/views/list/verification-list/index.vue'),
      meta: {
        locale: 'menu.list.verificationList',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // {
    //   path: 'card',
    //   name: 'Card',
    //   component: () => import('@/views/list/card/index.vue'),
    //   meta: {
    //     locale: 'menu.list.cardList',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default LIST;
