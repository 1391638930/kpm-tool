import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin, handleTokenValid, getLocalInfo } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const userInfo = getLocalInfo();

    if (userInfo) {
      await userStore.info(userInfo);
    }
    next();
  });
}
