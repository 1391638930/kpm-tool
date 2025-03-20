import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import qs from 'query-string';

export interface LoginData {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  username: string;
  password?: string;
  role: string;
  department: string;
  group: string;
  position: string;
  profile?: string;
  phone?: string;
}

export interface LoginRes {
  token: string;
  userId: number;
}

export interface TokenVerify {
  token: string;
}

export interface ContentTicketStatRecord {
  x: string[];
  y: number[];
  name: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/token/', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo(userId: number) {
  return axios.get<UserState>(`/api/user/users/${userId}`);
}

export interface emailParams {
  email: string;
}

export function getUserInfoByEmail(params: emailParams) {
  return axios.get<UserState>('/api/user/email/', {
    params,
  });
}

export function createUser(data: UserInfo) {
  return axios.post<UserInfo>('/api/user/users/', data);
}

export function delUserInfo(userId: number) {
  return axios.delete<UserState>(`/api/user/users/${userId}`);
}

export function updateUser(userId: number, data: UserInfo) {
  return axios.put<UserInfo>(`/api/user/users/${userId}`, data);
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export interface UserRecord {
  id: string;
  role: string;
  email: string;
  username: string;
  group: string;
  departmennt: string;
  position: string;
  updateTime: string;
}

export interface TicketFollowRecord {
  id: string;
  ticket_number: number;
  email: string;
}

export interface UserFilterRecord {
  id: string;
  filter_name: string;
  creator_email: string;
  description: string;
  visibility: string;
  cluster_type: string;
  filter_rules: object;
}

export interface TicketFollowParams extends Partial<TicketFollowRecord> {
  current: number;
  pageSize: number;
}

export interface UserFilterParams extends Partial<UserFilterRecord> {
  current: number;
  pageSize: number;
}

export interface UserFilterListRes {
  list: UserFilterRecord[];
  total: number;
}

export interface UserParams extends Partial<UserRecord> {
  current: number;
  pageSize: number;
}

export interface UserListRes {
  list: UserRecord[];
  total: number;
}

export interface TicketFollowListRes {
  list: TicketFollowRecord[];
  total: number;
}

export function queryUserList(params: UserParams) {
  return axios.get<UserListRes>('/api/user/users/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function verifyToken(token: TokenVerify) {
  return axios.post<TokenVerify>('/api/user/token/verify/', token);
}

export interface TicketFollow {
  cluster_number: number;
  email: string;
  cluster_type: string;
}

export interface BulkFollowNumber {
  numbers: [];
}

export function followTicket(data: TicketFollow) {
  return axios.post<TicketFollow>('/api/user/ticket-follow/', data);
}

export function cancelFollowTicket(data: TicketFollow) {
  return axios.post<TicketFollow>('/api/user/manage/unfollow-ticket/', data);
}

export function queryUserFollowList(params: TicketFollowParams) {
  return axios.get<TicketFollowListRes>('/api/user/ticket-follow/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryTicketStatByUser(cluster: string, week: string) {
  return axios.get<ContentTicketStatRecord[]>(
    '/api/v1/ticket-analysis-by-user/',
    { params: { cluster, week } }
  );
}

export function bulkFollowTicket(email: string, numbers: any) {
  return axios.post<BulkFollowNumber>('/api/user/bulk-follow/', {
    email,
    numbers,
  });
}

export function queryUserFilterList(params: UserFilterParams) {
  return axios.get<UserFilterListRes>('/api/user/filters/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function handleDelFilter(filterId: number) {
  return axios.delete(`/api/user/filters/${filterId}/`);
}

export function handleUpdateFilter(
  filterId: number,
  updateContent: UserFilterRecord
) {
  return axios.put(`/api/user/filters/${filterId}/`, updateContent);
}

export function handleAddFilter(addContent: Omit<UserFilterRecord, 'id'>) {
  return axios.post('/api/user/filters/', addContent);
}
