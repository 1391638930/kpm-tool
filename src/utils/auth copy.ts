import { verifyToken } from '@/api/user';

const TOKEN_KEY = 'token';
const USER_INFO = 'userInfo';

const isLogin = () => {
  const userInfo = {
    account: 'extern.lan.gao@audi.com.cn',
    address: null,
    birthday: null,
    city: null,
    county: null,
    create_time: '2023-02-22 17:22:42',
    delete_flag: 0,
    department: 1,
    email_receipt: [],
    employment_date: null,
    group: 10,
    id: 21,
    mobile: '18500228296',
    project: [1, 2, 3, 4, 5],
    province: null,
    role: [2, 6],
    unique_identifier: 'a7c930e3be23c814eacc986431c4cc75',
    update_time: '2023-04-27 13:12:16',
    username: 'Gao Lan',
    windows_account: null,
  };
  // const projects = {
  //   '1': 'One Platform',
  //   '2': 'TM Order System',
  //   '3': 'Request & Application',
  //   '4': 'KPM',
  //   '5': 'MANTIS',
  // };

  // let userInfo;
  // try {
  //   const userInfoString = localStorage.getItem(USER_INFO);
  //   userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  // } catch (error) {
  //   console.error('Invalid JSON string in localStorage:', error);
  //   userInfo = null;
  // }
  if (!userInfo) {
    return false;
  }


   const projectIds = (userInfo as any).project;

  // projectIds 包含4 返回True 否则返回·False
  const projectVerify = projectIds.some((id: number) => id === 4);
  console.log("tellme projectVerify ", projectVerify )
  return projectVerify;

  // return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const handleTokenValid = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      await verifyToken({ token });
    } catch (err) {
      clearToken();
    }
  }
};

export { isLogin, getToken, setToken, clearToken, handleTokenValid };
