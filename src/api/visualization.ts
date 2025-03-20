import axios from 'axios';
import qs from 'query-string';

export interface ContentScheduleRes {
  total_res: unknown;
  schedule_res: unknown;
}

export interface ContentCancelRes {
  total_res: unknown;
  typist_res: unknown;
}

export interface ContentVerifyRecord {
  x: string[];
  y: number[];
  name: string;
}

export interface ContentSeTdrRecord {
  x: string[];
  y: number[];
  name: string;
}

export interface ContentOpenTicketRecord {
  x: string[];
  y: number[];
  t: object[];
  name: string;
}

export interface ContentSystemTdrRecord {
  x: string[];
  y: number[];
  name: string;
}

export interface ContentPmRecord {
  x: string[];
  y: number[];
  name: string;
  total: number;
  weekDay: string;
}

export interface ContentTicketRecord {
  x: string[];
  y: number[];
  name: string;
}

export interface FlowTicketRecord {
  list: object;
  res: object;
}

export interface verifyWeekParams {
  function: string;
  supplier: string;
  ffd: string;
}

export function queryVerifyByWeek(
  clusterType: string,
  params: verifyWeekParams
) {
  return axios.get<ContentVerifyRecord[]>(`/api/verify/week/${clusterType}`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryTicketByWeek(clusterType: string) {
  return axios.get<ContentTicketRecord[]>(
    `/api/ticket/reg/week/${clusterType}`
  );
}

export function queryTicketByFlow(
  clusterType: string,
  supplier: string,
  flowRange: string
) {
  return axios.get<FlowTicketRecord>('/api/ticket/manage/ticket-flow/', {
    params: { clusterType, supplier, flowRange },
  });
}

export function queryTicketStatsByCancel(clusterType: string) {
  return axios.get<ContentCancelRes>('/api/ticket/manage/cancel-stats/', {
    params: { clusterType },
  });
}

export function querySeByTdr(clusterType: string, market: string) {
  return axios.get<ContentSeTdrRecord[]>('/api/tdr/manage/se-stats/', {
    params: { market, clusterType },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'bracket' });
    },
  });
}

export function queryOpenTicket(
  clusterType: string,
  market: string,
  func: Array<string>
) {
  return axios.get<ContentOpenTicketRecord[]>(
    '/api/ticket/manage/ticket-open/',
    {
      params: { market, clusterType, func },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'bracket' });
      },
    }
  );
}

export function ticketDetail(
  clusterType: string,
  market: string,
  func: Array<string>,
  pageNum: number,
  pageSize: number,
  yearWeek: string,
  dataType: string,
) {
  return axios.get<ContentOpenTicketRecord[]>(
    '/api/ticket/manage/ticket-open-page-list/',
    {
      params: {
        market,
        clusterType,
        func,
        page_num: pageNum,
        page_size: pageSize,
        year_week: yearWeek,
        data_type: dataType,
      },
    },
  );
}

export function querySystemQuoteByTdr(clusterType: string) {
  return axios.get<ContentSystemTdrRecord[]>('/api/tdr/manage/system-stats/', {
    params: { clusterType },
  });
}

export function queryPmByApk(clusterType: string) {
  return axios.get<ContentPmRecord[]>('/api/ticket/pm/apk-stats/', {
    params: { clusterType },
  });
}

export function queryPmByFlow(clusterType: string) {
  return axios.get<ContentPmRecord[]>('/api/ticket/pm/flow-stats/', {
    params: { clusterType },
  });
}

export function queryPmOverAll(clusterType: string) {
  return axios.get<ContentPmRecord[]>('/api/ticket/pm/overall-stats/', {
    params: { clusterType },
  });
}

export function queryTicketByVersion(clusterType: string, variant: string) {
  return axios.get<ContentTicketRecord[]>(
    `/api/ticket/reg/version/${clusterType}`,
    { params: { variant } }
  );
}

export function queryVerifyBySupplier(
  clusterType: string,
  week: string,
  ffd: string
) {
  return axios.get<ContentVerifyRecord[]>(
    `/api/verify/supplier/${clusterType}`,
    { params: { week, ffd } }
  );
}

export function queryVerifyByFunc(
  clusterType: string,
  week: string,
  ffd: string
) {
  return axios.get<ContentVerifyRecord[]>(`/api/verify/func/${clusterType}`, {
    params: { week, ffd },
  });
}

export function queryVerifyByEEResult(clusterType: string, week: string) {
  return axios.get<ContentScheduleRes>(`/api/verify/ee-result/${clusterType}`, {
    params: { week },
  });
}

export interface SupplierRes {
  name: string;
}

export interface FunctionRes {
  name: string;
}

export function querySupplierList() {
  return axios.get<SupplierRes[]>('/api/verify/manage/supplier/list/', {});
}

export function queryFunctionList() {
  return axios.get<FunctionRes[]>('/api/verify/manage/function/list/', {});
}

// performance report获取OverallAverage
export function queryOverallAverage(project: string) {
  return axios.get('/api/perf/manage/av_feature_stats/', {
    params: { project },
  });
}

// performance report根据project version获取最差subcategory
export function queyrWorstSubcategoryStats(version: string, project: string) {
  return axios.get('/api/perf/manage/worst_subcategory_stats/', {
    params: {
      version,
      project,
    },
  });
}

// performance report获取version,function,feature下拉列表
export function queryMutiOptionList(project: string, fields: string) {
  return axios.get('/api/perf/manage/field_group_info/', {
    params: {
      project,
      field_group_info: fields,
    },
  });
}

// performance report获取不同版本的统计
export function queryStatsForDiffVer(project: string) {
  return axios.get('/api/perf/manage/perf_by_ver_stats/', {
    params: {
      project,
    },
  });
}

// performance report根据version, function, feature获取统计
export function queryStatsForCompare(
  project: string,
  version: Array<string>,
  func: string,
  featrue: Array<string>,
) {
  return axios.get('/api/perf/manage/compare_subcategory_stats/', {
    params: {
      project,
      version,
      function: func,
      feature: featrue,
    },
  });
}

// performance report根据function，获取对应的feature
export function queryFeatureByFunc(pro: string, func: string) {
  return axios.get('/api/perf/manage/get_feature_by_func/', {
    params: {
      project: pro,
      function: func,
    },
  });
}

// 1 - Analysis 2 - In fix 3 - In Verification 4 - Solved
export function querySupplierTicket(category: number, groupBy: string) {
  return axios.post('/api/ticket/supplier/ticket-data/', {
    category,
    group_by: groupBy,
  });
}

export function querySupplierActionTicket(category: number, groupBy: string) {
  return axios.post('/api/ticket/taskboard/taskboard-data/', {
    category,
    group_by: groupBy,
  });
}

export function getSupplierTicketFilters() {
  return axios.get('/api/ticket/taskboard/extra-filter-info/');
}

export function saveTicketFilters(filters: string) {
  return axios.post('/api/ticket/taskboard/extra-filter-update/', {
    filter_names: filters
  })
}