import axios from 'axios';
import qs from 'query-string';

export interface BaseInfoResponse {
  status: any[];
  creator: any[];
  cluster: any[];
}

const tmsPrefix = import.meta.env.VITE_BASE_PATH_TMS;

export function querySubBaseInfo(params: any) {
  return axios.post<BaseInfoResponse>(
    '/api/user/manage/sub-ticket-group-status/',
    params
  );
}

export function getInfo() {
  return axios.get(`${tmsPrefix}v1.0.0/info`);
}

export function getUser(params: any) {
  return axios.post(`${tmsPrefix}v1.0.0/tms/get/user`, params);
}

export function addUser(params: any) {
  return axios.post(`${tmsPrefix}v1.0.0/tms/add/project/user`, params);
}

export function editUser(params: any) {
  return axios.post(`${tmsPrefix}v1.0.0/tms/edit/user/pr/currency`, params);
}
