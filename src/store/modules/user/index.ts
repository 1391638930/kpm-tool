import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  getUserInfoByEmail,
  emailParams,
} from '@/api/user';
import { setToken, clearToken, getToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: 0,
    username: '',
    password: '',
    avatar:
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    email: '',
    create_time: '',
    group: '',
    department: '',
    position: '',
    phone: '',
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information

    async info(userInfo: any) {
      // console.log('info email', res.data, email);
      const res = {
        avatar:
          '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
        email: userInfo.account ? userInfo.account : '',
        mobile: userInfo.mobile,
        username: userInfo.username,
      };

      res.avatar =
        '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png';
      // const data = {
      //   name: 'admin',
      //   avatar:
      //     '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
      //   email: 'extern.lan.gao@audi.com.cn',
      //   job: 'frontend',
      //   jobName: '前端艺术家',
      //   organization: 'Frontend',
      //   organizationName: '前端',
      //   location: 'beijing',
      //   locationName: '北京',
      //   introduction: '人潇洒，性温存',
      //   personalWebsite: 'https://www.arco.design',
      //   phone: '185****8296',
      //   registrationDate: '2013-05-10 12:10:00',
      //   accountId: '15012312300',
      //   certification: 1,
      //   role,
      // };
      // const res = {
      //   data,
      //   status: 'ok',
      //   msg: '请求成功',
      //   code: 20000,
      // };
      this.setInfo(res);
    },
    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        this.setInfo({ userId: res.data.userId });
        const resUserInfo = await getUserInfo(res.data.userId);
        resUserInfo.data.avatar =
          '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png';
        this.setInfo(resUserInfo.data);
        // setUserStorage(resUserInfo.data);
        setToken(res.data.token);
      } catch (err) {
        // console.log('Login clear Token');
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();

      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        // await userLogout();
      } finally {
        this.logoutCallBack();
        clearToken();
        // console.log('logout clear Token');
      }
    },
  },
});

export default useUserStore;
