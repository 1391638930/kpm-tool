<template>
  <div class="container" :style="{ height: ticketDetailView ? 'auto' : 'calc(100vh - 133px)' }">
    <Breadcrumb :items="['menu.workspace', 'menu.workspace.taskBoard']" />
    <template v-if="!ticketDetailView">
      <div>
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }" class="head-box">
            <a-card class="general-card">
              <div class="head-options">
                <a-space>
                  Group By:
                  <a-select
                    v-model="groupBy"
                    :style="{ width: '200px' }"
                    placeholder="Group by"
                  >
                    <a-option value="Cluster">Cluster</a-option>
                    <a-option value="Age">Age</a-option>
                    <a-option value="Function">Function</a-option>
                  </a-select>
                </a-space>

                <a-space>
                  <a-button v-if="actionType === 'action'" @click="openFilter">Extra Data</a-button>
                  <a-radio-group v-model="actionType" type="button" @change="typeChange">
                    <a-radio value="action">Action</a-radio>
                    <a-radio value="external">External</a-radio>
                  </a-radio-group>
                </a-space>
              </div>
            </a-card>
          </a-grid-item>
        </a-grid>
      </div>

      <div class="board-container">
        <div class="board-columns">
          <div v-for="status in statusList" :key="status.key" class="board-column">
            <a-spin :loading="status.loading" style="width: 100%; height: 100%;">
              <div class="column-header">
                <span class="title">{{ status.title }}</span>
                <span class="count">{{ status.count }}</span>
              </div>
              <div class="column-content">
                <div v-for="group in status.groups" :key="group.group_name" class="group-section">
                  <div class="group-header" @click="toggleGroup(group)">
                    <a-space>
                      <icon-caret-right v-if="!group.expanded" />
                      <icon-caret-down v-else />
                      <span>{{ group.group_name }}</span>
                      <span class="group-count">({{ group.num }} tickets)</span>
                    </a-space>
                  </div>
                  <div v-show="group.expanded" class="group-content">
                    <a-card 
                      v-for="ticket in group.group_data" 
                      :key="ticket.number" 
                      class="task-card"
                      @click="handleCardClick(ticket)"
                      :style="{border: ticket.filter_source ? '1px solid #165dff' : ''}"
                    >
                      <div
                        class="status-bar" 
                        :style="{ backgroundColor: getAgeColor(ticket.age) }"
                      />
                      <div class="task-wrapper">
                        <div class="task-header">
                          <span class="task-id">{{ ticket.number }}</span>
                          <div class="status-dots">
                            <span class="status-circle">{{ ticket.status }}</span>
                            <span class="status-circle">{{ ticket.engineering_status }}</span>
                            <span class="status-circle">{{ ticket.l_status }}</span>
                          </div>
                        </div>
                        <div class="task-main">
                          <div class="task-title">{{ ticket.short_text }}</div>
                          <div class="typist-supplier">
                            <span class="typist">{{ ticket.typist_user }}</span>
                            <span class="supplier" v-if="ticket.supplier">{{ ticket.supplier }}</span>
                          </div>
                        </div>
                      </div>
                    </a-card>
                  </div>
                </div>
              </div>
            </a-spin>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="detail-view">
        <TicketDetailInfo
          :item="ticketItemDetail"
          :ticket-change-item="ticketChangeRecord"
          @back-detail="handleBackDetail"
        />
      </div>
    </template>

    <a-modal v-model:visible="filterDialog" @ok="filterSave" @cancel="filterCancel">
      <template #title>
        Add data via filter
      </template>
      <div>
        <a-select
          v-model="curFilter"
          placeholder="Select filter"
          multiple
          allow-clear
        >
          <a-option
            v-for="item of filterList"
            :key="item.filter_name"
            :value="item.filter_name"
            :label="item.filter_name"
          />
        </a-select>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { querySupplierTicket, querySupplierActionTicket, getSupplierTicketFilters, saveTicketFilters } from '@/api/visualization';
import { queryTicketChangeRecord, queryTicketList } from '@/api/list';
// @ts-ignore
import TicketDetailInfo from '@/views/list/kpm-list/components/ticket-detail-info.vue';
// @ts-ignore
import Storage from '@/utils/storage';

const ls = new Storage();
const actionType = ref('action');
const groupBy = ref('Cluster');
const filterDialog = ref(false);

interface Ticket {
  cluster_type: string;
  status: string;
  engineering_status: string;
  l_status: string;
  short_text: string;
  supplier: string;
  change_ts_problem: string;
  number: number;
  func_dimension: string;
  time_diff: number;
  age: string;
  typist_user: string;
  filter_source: boolean;
}

interface Group {
  group_name: string;
  num: number;
  group_data: Ticket[];
  expanded?: boolean;
}

interface StatusColumn {
  key: string;
  title: string;
  count: number;
  groups: Group[];
  loading?: boolean;
}

interface filterItem {
  filter_name: string;
  is_selected: boolean;
}
const filterList = ref<filterItem[]>([]);
const curFilter = ref<string[]>([]);

const statusList = ref<StatusColumn[]>([
  {
    key: 'open',
    title: 'Open',
    count: 0,
    groups: [],
    loading: false
  },
  {
    key: 'verification',
    title: 'Verification',
    count: 0,
    groups: [],
    loading: false
  },
  {
    key: 'cancelled',
    title: 'Cancelled',
    count: 0,
    groups: [],
    loading: false
  },
  {
    key: 'closed',
    title: 'Closed',
    count: 0,
    groups: [],
    loading: false
  }
]);

const loadColumnData = async (category: number) => {
  const column = statusList.value[category - 1];
  if (!column) return;
  
  column.loading = true;
  if (actionType.value === 'external') {
    try {
      const res = await querySupplierTicket(category, groupBy.value);
      const list: Group[] = res.data;
      column.groups = list.map(group => ({
        ...group,
        expanded: false
      }));
      column.count = list.reduce((sum, group) => sum + group.num, 0);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      column.loading = false;
    }
  } else if (actionType.value === 'action') {
    // 执行 action 操作
    try {
      const res = await querySupplierActionTicket(category, groupBy.value);
      const list: Group[] = res.data;
      column.groups = list.map(group => ({
        ...group,
        expanded: false
      }));
      column.count = list.reduce((sum, group) => sum + group.num, 0);
    } catch (err) { 
      console.error('Failed to load data:', err);
    } finally {
      column.loading = false;
    }
  }
};

const initData = () => {
  loadColumnData(1);
  loadColumnData(2);
  loadColumnData(3);
  loadColumnData(4);
}
initData();

const toggleGroup = (group: Group) => {
  group.expanded = !group.expanded;
};

watch(groupBy, () => {
  initData();
});

const typeChange = () => {
  if (actionType.value === 'action') {
    statusList.value = [
      {
        key: 'open',
        title: 'Open',
        count: 0,
        groups: [],
        loading: false
      },
      {
        key: 'verification',
        title: 'Verification',
        count: 0,
        groups: [],
        loading: false
      },
      {
        key: 'cancelled',
        title: 'Cancelled',
        count: 0,
        groups: [],
        loading: false
      },
      {
        key: 'closed',
        title: 'Closed',
        count: 0,
        groups: [],
        loading: false
      }
    ]
  } else {
    statusList.value = [
      {
        key: 'analysis',
        title: 'Analysis',
        count: 0,
        groups: [],
        loading: false
      },
      {
        key: 'inFix',
        title: 'In Fix',
        count: 0,
        groups: [],
        loading: false
      },
      {
        key: 'inVerification',
        title: 'In Verification',
        count: 0,
        groups: [],
        loading: false
      },
      {
        key: 'solved',
        title: 'Solved',
        count: 0,
        groups: [],
        loading: false
      }
    ]
  }
  initData();
}

const getAgeColor = (age: string) => {
  switch (age) {
    case 'N<3':
      return 'transparent';
    case '3<=N<5':
      return 'rgb(255, 185, 185)';
    case '5<=N<8':
      return 'rgb(255, 45, 5)';
    case '8<=N<15':
      return 'rgb(150, 25, 5)';
    case 'N>=15':
      return 'rgb(60, 1, 1)';
    default:
      return 'transparent';
  }
};

const ticketDetailView = ref(false);
const ticketItemDetail = ref({});
const ticketChangeRecord = ref([] as any);

const handleCardClick = async (ticket: Ticket) => {
  try {
    const userInfo = ls.get('userInfo')
    const params = {
      carline: 'all',
      classify: 'all',
      clusterType: ticket.cluster_type,
      current: 1,
      email: userInfo.account,
      number: ticket.number,
      pageSize: 10,
      platform: 'all',
      problem_description: '',
      rating: 'all',
      shift_status: 'all',
      short_text: '',
      total: 0,
      year_week: 'all',
      brand: 'all'
    }
    const { data: ticketData } = await queryTicketList(params)
    ticketItemDetail.value = ticketData.list[0]

    const { data: recordData } = await queryTicketChangeRecord(
      ticket.cluster_type,
      ticket.number.toString()
    );
    ticketChangeRecord.value = recordData.list;
    ticketDetailView.value = true;
  } catch (err) {
    console.error('Failed to load ticket details:', err);
  }
};

const handleBackDetail = () => {
  ticketDetailView.value = false;
  ticketItemDetail.value = {};
  ticketChangeRecord.value = [];
};

const getFilters = () => {
  getSupplierTicketFilters().then((res: any) => {
    console.log(res);
    if (res.code === 20000) {
      filterList.value = res.data.filter_names
      curFilter.value = res.data.filter_names.filter((item: { is_selected: boolean; }) => item.is_selected)
      .map((item: {filter_name: string}) => item.filter_name);
    }
  })
}

const openFilter = () => {
  getFilters();
  filterDialog.value = true;
}

const filterSave = () => {
  const list = curFilter.value.join(',')
  saveTicketFilters(list).then((res: any) => {
    if (res.code === 20000) {
      initData();
      filterDialog.value = false;
    }
  })
}

const filterCancel = () => {
  filterDialog.value = false;
}
</script>

<style lang="less" scoped>
.container {
  background-color: var(--color-fill-2);
  padding: 16px 20px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;

  .head-box {
    margin-bottom: 16px;
  }

  .head-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
  }
}

.board-container {
  flex: 1;
  overflow: hidden;
  background-color: var(--color-fill-2);
  border-radius: 4px;
  overflow-x: auto;
  height: calc(100vh - 250px);
}

.board-columns {
  display: flex;
  gap: 16px;
  height: 100%;
  min-width: min-content;
}

.board-column {
  flex: 1;
  width: 0;
  min-width: 260px;
  background: var(--color-bg-2);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  :deep(.arco-spin) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :deep(.arco-spin-children) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .column-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border);

    .title {
      font-weight: 500;
      color: var(--color-text-1);
    }

    .count {
      background: var(--color-fill-3);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }
  }

  .column-content {
    padding: 8px;
    flex: 1;
    overflow-y: auto;
  }
}

.group-section {
  margin-bottom: 8px;

  .group-header {
    padding: 8px;
    cursor: pointer;
    color: var(--color-text-1);
    font-weight: 500;

    &:hover {
      background: var(--color-fill-2);
      border-radius: 4px;
    }

    .group-count {
      color: var(--color-text-3);
      font-size: 12px;
      font-weight: normal;
      min-width: max-content;
    }
  }

  .group-content {
    padding: 8px;
  }
}

.task-card {
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  :deep(.arco-card-body) {
    padding: 12px 16px;
    display: flex;
    word-break: break-all;
  }
}

.task-wrapper {
  display: flex;
  gap: 12px;
  flex-direction: column;
  width: 100%;
}

.status-bar {
  min-width: 6px;
  border-radius: 3px;
  margin: -12px 12px -12px -16px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.task-id {
  background: var(--color-fill-2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-text-3);
}

.status-dots {
  display: flex;
  gap: 4px;
  
  .status-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgb(var(--gray-3));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: rgb(var(--gray-8));
    background-color: rgb(var(--gray-1));
  }
}

.task-main {
  flex: 1;
  min-width: 0;
}

.task-title {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-text-1);
}

.typist-supplier {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-3);
  display: flex;
  flex-direction: column;
  .typist {
    margin-bottom: 4px;
  }
  .typist, .supplier {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .typist::before, .supplier::before {
    content: 'R';
    min-width: 20px;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-text-3);
    border-radius: 50%;
    margin-right: 4px;
  }
  .supplier::before {
    content: 'S';
  }
}

.detail-view {
  flex: 1;
  overflow-y: auto;
  background-color: var(--color-bg-2);
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
}
</style>