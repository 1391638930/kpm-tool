import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')!);
      let ifPass = false;
      route.meta?.roles?.forEach((item) => {
        if (item !== '*' && userInfo?.role.includes(Number(item))) {
          ifPass = true;
        }
      })
      return (
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        ifPass
      );
    },
    findFirstPermissionRoute(_routers: any, role = 'super_admin') {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
