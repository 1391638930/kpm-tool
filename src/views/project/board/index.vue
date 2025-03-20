<template>
  <div class="container">
    <Breadcrumb :items="['menu.project', 'menu.project.board']" />
    <div class="boardBox">
      <Empty
        v-if="projectList.length == 0"
        @addProject="addProjectModalVisible = true"
      />
      <template v-if="projectList.length > 0">
        <div class="controlBar">
          <div>
            <a-cascader
              :options="projectClusterOption"
              v-model="currentProjectCluster"
              :style="{ width: '220px' }"
              placeholder="Project / Cluster"
              path-mode
              @change="projectClusterChange"
            />
          </div>
          <a-button type="primary" @click="addProjectModalVisible = true">
            {{ $t('menu.project.addProjectBtn') }}
          </a-button>
        </div>
        <div class="contentBox">
          <el-scrollbar>
            <StatisticChart
              ref="statisticChartRef"
              v-if="currentProjectCluster.length"
              :currentProject="currentProjectCluster[0]"
              :currentCluster="currentProjectCluster[1]"
            />
            <Panel
              ref="panelRef"
              v-if="currentProjectCluster.length"
              :currentProject="currentProjectCluster[0]"
              :currentCluster="currentProjectCluster[1]"
            />
          </el-scrollbar>
        </div>
      </template>
      <AddProjectModal
        :visible="addProjectModalVisible"
        :projectClusterOption="projectClusterOption"
        @closeModal="addProjectModalVisible = false"
        @updateBoard="updateBoard"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { getFilter, getProject, getProjectCluster } from '@/api/project';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import Empty from './components/empty.vue';
  import AddProjectModal from './components/addProjectModal.vue';
  import StatisticChart from './components/statisticChart.vue';
  import Panel from './components/panel.vue';

  const router = useRouter();

  const userStore = useUserStore();

  const addProjectModalVisible = ref(false);

  onMounted(async () => {
    await getFilterFunc();
  });
  const filterList = ref([]);
  const getFilterFunc = async () => {
    const res = await getFilter({
      creator_email: userStore.email,
    });
    filterList.value = res.data.list;
  };

  onMounted(async () => {
    await getProjectFunc();
  });
  const projectList = ref([]);
  const getProjectFunc = async () => {
    const res = await getProject();
    projectList.value = res.data;
  };

  onMounted(async () => {
    await getProjectClusterFunc();
  });
  const currentProjectCluster = ref<any[]>([]);
  const projectClusterOption = ref([]);
  const getProjectClusterFunc = async () => {
    const res = await getProjectCluster();
    projectClusterOption.value = res.data;
    currentProjectCluster.value[0] = res.data[0].value;
    currentProjectCluster.value[1] = res.data[0].children[0].value;
  };

  interface StatisticChartType {
    updateStatistic: () => void;
    getWeekRangeFunc: () => void;
  }
  const statisticChartRef = ref<StatisticChartType | null>(null);

  interface panelType {
    getTicketGroupStatsFunc: () => void;
  }
  const panelRef = ref<panelType | null>(null);

  const projectClusterChange = (e: any) => {
    nextTick(() => {
      statisticChartRef.value?.updateStatistic();
      statisticChartRef.value?.getWeekRangeFunc();
      panelRef.value?.getTicketGroupStatsFunc();
    });
  };

  const updateBoard = async () => {
    await getProjectFunc();
    await getProjectClusterFunc();
    statisticChartRef.value?.updateStatistic();
    statisticChartRef.value?.getWeekRangeFunc();
    panelRef.value?.getTicketGroupStatsFunc();
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 0 20px;
    height: calc(100vh - 133px);
  }

  .boardBox {
    height: calc(100% - 56px);
    background-color: #ffffff;
    box-shadow: 0 0 20px var(--color-neutral-3);
    border-radius: 5px;
    padding: 20px 10px;
    box-sizing: border-box;
  }

  .controlBar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9e9e9;
    margin: 0 10px;
  }

  .contentBox {
    height: calc(100% - 43px);
    width: 100%;
  }
</style>
