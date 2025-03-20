import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
import localePublicDashboard from '@/views/dashboard/publicDashboard/locale/en-US';
import localeMyDashboard from '@/views/dashboard/myDashboard/locale/en-US';

import localeMonitor from '@/views/dashboard/monitor/locale/en-US';

import localeKpmList from '@/views/list/kpm-list/locale/en-US';
import localeVerificationList from '@/views/list/verification-list/locale/en-US';

import localeStepForm from '@/views/form/step/locale/en-US';
import localeGroupForm from '@/views/form/group/locale/en-US';

import localeBasicProfile from '@/views/profile/basic/locale/en-US';

import localeVerifyAnalysis from '@/views/visualization/verification-data-analysis/locale/en-US';
import localeTdrAnalysis from '@/views/visualization/tdr-data-analysis/locale/en-US';
import localePmAnalysis from '@/views/visualization/pm-data-analysis/locale/en-US';
import localeRegressionAnalysis from '@/views/visualization/regression-data-analysis/locale/en-US';

import localeSuccess from '@/views/result/success/locale/en-US';
import localeError from '@/views/result/error/locale/en-US';

import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';

import localeUserFollow from '@/views/user/follower/locale/en-US';
import localeUserList from '@/views/user/user-list/locale/en-US';
import localeUserInfo from '@/views/user/info/locale/en-US';
import localeUserFilter from '@/views/user/filter/locale/en-US';
import localeTicketStats from '@/views/user/ticket-stats/locale/en-US';
import localeUserSetting from '@/views/user/setting/locale/en-US';

import localeProjectBoard from '@/views/project/board/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'Ticket Manage',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.workspace': 'Workspace',
  'menu.arcoWebsite': 'Arco Design',
  'menu.project': 'Project Board',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
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
  ...localeRegressionAnalysis,
  ...localeTdrAnalysis,
  ...localePmAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeUserFollow,
  ...localeUserList,
  ...localeTicketStats,
  ...localeUserFilter,
  ...localeProjectBoard,
};
