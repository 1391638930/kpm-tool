import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    if (response.data.code === 300) {
      // const envUrl = "test";
      const envUrl: string = 'dev';
      // const envUrl = "online";
      const envStr = envUrl === 'online' ? '' : '_' + envUrl;
      window.location.href = `https://www.op-oneplatform.com/op11${envStr}/#/ssologin?is_sso=0&service=op11&exp=43200&next_url=${encodeURIComponent(window.location.href)}`;
      return response;
    }
    const res = response.data;
    if (
      response.config.url === '/api/verify/manage/download/' ||
      response.config.url === '/api/ticket/manage/download/' ||
      response.config.url === '/api/user/manage/download/' ||
      response.config.url === '/api/user/users/0' ||
      response.config.url?.indexOf('tms') !== -1
    ) {
      return response;
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message.error({
        content: res.msg || 'Code Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/api/user/users/'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.msg || 'Code Error'));
    }
    // console.log(response.config.url, response)
    return res;
  }
  // (error) => {
  //   Message.error({
  //     content: error.msg || 'Request Error',
  //     duration: 5 * 1000,
  //   });
  //   return Promise.reject(error);
  // }
);
