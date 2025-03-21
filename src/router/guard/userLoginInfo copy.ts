import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin, handleTokenValid } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    // await handleTokenValid();
    if (isLogin()) {
      next();
      // if (userStore.role) {
      //   next();
      // } else {
      //   try {
      //     await userStore.info(userStore.userId as number);
      //     next();
      //   } catch (error) {
      //     await userStore.logout();
      //     next({
      //       name: 'login',
      //       query: {
      //         redirect: to.name,
      //         ...to.query,
      //       } as LocationQueryRaw,
      //     });
      //   }
      // }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}

// export default function setupUserLoginInfoGuard(router: Router) {
//   router.beforeEach(async (to, from, next) => {
//     NProgress.start();
//     const userStore = useUserStore();
//     await handleTokenValid();
//     if (isLogin()) {
//       if (userStore.role) {
//         next();
//       } else {
//         try {
//           await userStore.info(userStore.userId as number);
//           next();
//         } catch (error) {
//           await userStore.logout();
//           next({
//             name: 'login',
//             query: {
//               redirect: to.name,
//               ...to.query,
//             } as LocationQueryRaw,
//           });
//         }
//       }
//     } else {
//       if (to.name === 'login') {
//         next();
//         return;
//       }
//       next({
//         name: 'login',
//         query: {
//           redirect: to.name,
//           ...to.query,
//         } as LocationQueryRaw,
//       });
//     }
//   });
// }
