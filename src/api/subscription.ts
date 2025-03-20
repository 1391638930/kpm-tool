import axios from 'axios';
import qs from 'query-string';

// export interface FlowTicketRecord {
//   list: object;
//   res: object;
// }
// export function queryTicketByFlow(
//   clusterType: string,
//   supplier: string,
//   flowRange: string
// ) {
//   return axios.get<FlowTicketRecord>('/api/ticket/manage/ticket-flow/', {
//     params: { clusterType, supplier, flowRange },
//   });
// }

export interface BaseInfoResponse {
  status: any[];
  creator: any[];
  cluster: any[];
}
export function querySubBaseInfo(params: any) {
  return axios.post<BaseInfoResponse>('/api/user/manage/sub-ticket-group-status/', params);
}

// export interface TicketResponse {
//   status_total: number;
//   [creator: number]: {
//     total: number;
//   };
// }
export function querySubTicket(params: any) {
  return axios.post('/api/user/manage/sub-ticket-group-stats/', params);
}

export function unsubTicket(params: any) {
  return axios.post('/api/user/manage/batch-unfollow-ticket/', params);
}

export function syncSubTicketByUser() {
  return axios.get('/api/user/manage/sync-sub-ticket-by-user/');
}
