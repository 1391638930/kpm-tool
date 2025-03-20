import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

export interface ContentTicketRecord {
  x: string[];
  y: number[];
  name: string;
}

export function queryTicketStatsByFunc(clusterType: string) {
  return axios.get<ContentTicketRecord[]>('/api/ticket/manage/func-stats/', {
    params: { clusterType },
  });
}
export function queryTicketStats() {
  return axios.get('/api/ticket/manage/count/');
}

export function queryTicketStatsByWeek(clusterType: string) {
  return axios.get<ContentTicketRecord[]>(
    '/api/ticket/manage/ticket-by-week/',
    {
      params: { clusterType },
    }
  );
}

export function queryMyDashboardList(params: any) {
  return axios.get('/api/dashboard/', {
    params,
  });
}

export function createDashboard(params: any) {
  return axios.post('/api/dashboard/', params);
}

export function editDashboard(dashboardId: number, params: any) {
  return axios.put(`/api/dashboard/${dashboardId}/`, params);
}

export function deleteDashboard(dashboardId: number) {
  return axios.delete(`/api/dashboard/${dashboardId}/`);
}

export function getDashboardChart(params: any) {
  return axios.get('/api/dashboard/chart/', {
    params,
  });
}

export function getChartData(params: any) {
  return axios.get('/api/dashboard/chart/get-chart-data/', {
    params,
  });
}

export function getDataSource() {
  return axios.get('/api/dashboard/chart/get-data-source/');
}

export function getGroupField() {
  return axios.get('/api/dashboard/chart/get-group-field-info/');
}

export function createChart(params: any) {
  return axios.post('/api/dashboard/chart/', params);
}

export function editChart(chartId: number, params: any) {
  return axios.put(`/api/dashboard/chart/${chartId}/`, params);
}
