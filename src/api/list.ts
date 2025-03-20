import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface TicketRecord {
  id: string;
  clusterNnumber: number;
  project: string;
  eProject: string;
  clusterType: string;
  rating: string;
  week: string;
  implementationDate: string;
  shortText: string;
  updateTime: string;
  userId: number;
}

export interface TicketParams extends Partial<TicketRecord> {
  current: number;
  pageSize: number;
}

export interface TicketListRes {
  list: TicketRecord[];
  total: number;
}

export function queryTicketList(params: TicketParams) {
  return axios.get<TicketListRes>('/api/ticket/manage/list/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function subscribeAllTicket(params: TicketParams) {
  return axios.get<TicketListRes>('/api/ticket/manage/subscribe-all/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface VerifyRecord {
  id: string;
  number: number;
  eProject: string;
  clusterType: string;
  rating: string;
  eeResults: string;
  supplier: string;
  funcDimension: string;
  week: string;
  shortText: string;
  updateTime: string;
}

export interface VerifyParams extends Partial<VerifyRecord> {
  current: number;
  pageSize: number;
}

export interface VerifyListRes {
  list: VerifyRecord[];
  total: number;
}

export interface VerifyUpdateTime {
  updateTime: string;
}

export interface TicketUpdateTime {
  updateTime: string;
}

export interface VerifyWeek {
  year_week: string;
}

export interface TicketWeek {
  year_week: string;
}

export interface ChangeField {
  change_field: string;
}

export interface TicketChangeRes {
  list: TicketRecord[];
  total: number;
}

export interface TicketAnalyzeRecord {
  name: string;
  value: number;
}

export function queryVerifyList(params: VerifyParams) {
  return axios.get<VerifyListRes>('/api/verify/manage/list/', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function downloadVerifyData(data: VerifyRecord) {
  return axios.post<VerifyRecord>('/api/verify/manage/download/', data);
}

export function queryVerifyUpdateTime() {
  return axios.get<VerifyUpdateTime>('/api/verify/manage/update_time/', {});
}

export function queryTicketUpdateTime() {
  return axios.get<TicketUpdateTime>('/api/ticket/manage/update_time/', {});
}
export function queryTicketWeekList(clusterType: string) {
  return axios.get<TicketWeek[]>('/api/ticket/manage/week/list/', {
    params: { clusterType },
  });
}

export function queryTicketFieldChangeList(
  clusterType: string,
  changeField: string
) {
  return axios.get<ChangeField[]>('/api/ticket/manage/field-change/list/', {
    params: { clusterType, changeField },
  });
}

export function queryVerifyWeekList(clusterType: string) {
  return axios.get<VerifyWeek[]>('/api/verify/manage/week/list/', {
    params: { clusterType },
  });
}

export function queryTicketChangeRecord(clusterType: string, number: string) {
  return axios.get<TicketChangeRes>(
    '/api/ticket/manage/ticket-change-record/',
    {
      params: { clusterType, number },
    }
  );
}

export function queryTicketStatusChange(
  clusterType: string,
  number: string,
  changeField: string
) {
  return axios.get<TicketChangeRes>(
    '/api/ticket/manage/ticket-status-change/',
    {
      params: { clusterType, number, changeField },
    }
  );
}

export function queryTicketAnalyzeChange(
  clusterType: string,
  number: string,
  analyzeType: string
) {
  return axios.get<TicketAnalyzeRecord[]>(
    '/api/ticket/manage/ticket-change-analyze/',
    {
      params: { clusterType, number, analyzeType },
    }
  );
}

