import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localePublicDashboard from '@/views/dashboard/publicDashboard/locale/zh-CN';
import localeMyDashboard from '@/views/dashboard/myDashboard/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

import localeKpmList from '@/views/list/kpm-list/locale/zh-CN';
import localeVerificationList from '@/views/list/verification-list/locale/zh-CN';

import localeStepForm from '@/views/form/step/locale/zh-CN';
import localeGroupForm from '@/views/form/group/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

import localeVerifyAnalysis from '@/views/visualization/verification-data-analysis/locale/zh-CN';

import localeTdrAnalysis from '@/views/visualization/tdr-data-analysis/locale/en-US';
import localePmAnalysis from '@/views/visualization/pm-data-analysis/locale/en-US';
import localeRegressionAnalysis from '@/views/visualization/regression-data-analysis/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';
import localeTicketStats from '@/views/user/ticket-stats/locale/en-US';

import localeUserFollow from '@/views/user/follower/locale/zh-CN';
import localeUserUserList from '@/views/user/user-list/locale/zh-CN';

import localeProjectBoard from '@/views/project/board/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': 'Ticket 管理',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.workspace': '工作区',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.project': '项目',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localePublicDashboard,
  ...localeMyDashboard,

  ...localeMonitor,
  ...localeVerificationList,
  ...localeKpmList,
  ...localeStepForm,
  ...localeGroupForm,
  ...localeBasicProfile,
  ...localeVerifyAnalysis,
  ...localeTdrAnalysis,
  ...localePmAnalysis,
  ...localeRegressionAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeUserFollow,
  ...localeUserUserList,
  ...localeTicketStats,
  ...localeProjectBoard,
};
