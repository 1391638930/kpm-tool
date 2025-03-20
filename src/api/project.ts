import axios from 'axios';

export function getFilter(params: any) {
  return axios.get('/api/user/filters/', {
    params,
  });
}

export function getProject() {
  return axios.get('/api/project-board/list-project-names/');
}

export function addProject(params: any) {
  return axios.post('/api/project-board/', params);
}

export function getStatistic(params: any) {
  return axios.get('/api/project-board/board-in-out-stats/', {
    params,
  });
}

export function getProjectCluster() {
  return axios.get('/api/project-board/list-project-cluster-info/');
}

export function getFilterMapping(params: any) {
  return axios.get('/api/project-board/list-project-board-mapping/', {
    params,
  });
}

export function getTicketGroupStatus(params: any) {
  return axios.post('/api/project-board/sub-ticket-group-status/', params);
}

export function getTicketGroupStats(params: any) {
  return axios.post('/api/project-board/sub-ticket-group-stats/', params);
}

export function getWeekRange(params: any) {
  return axios.get('/api/project-board/get-in-out-week-range/', {
    params,
  });
}

export function addExpectData(params: any) {
  return axios.post('/api/project-board/update-trend-lines/', params);
}