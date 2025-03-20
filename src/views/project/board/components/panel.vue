<template>
  <div class="panelBox">
    <div class="title">Project Board</div>
    <div class="header">
      <div
        class="headerItem"
        :style="{
          width: groupItemWidth,
        }"
        v-for="(item, key) in groupStatusList"
        :key="key"
      >
        {{ item + ' ' + groupStatsNum[key] }}
      </div>
    </div>
    <div class="contentBox">
      <div
        class="contentColumn"
        :style="{
          width: groupItemWidth,
        }"
        v-for="(item, key) in groupStatusList"
        :key="key"
      >
        <div
          class="ticketItem"
          v-for="(ticketItem, ticketId) in groupStats[key] || {}"
          :key="ticketId"
        >
          <div class="topBox">
            <span class="id">{{ ticketId }}</span>
            <span>{{ ticketItem.short_text }}</span>
          </div>
          <div class="name" v-if="ticketItem.responsible_problem_solver_user">
            <icon-user style="margin-right: 6px" />
            {{ ticketItem.responsible_problem_solver_user }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/store';
  import { getTicketGroupStatus, getTicketGroupStats } from '@/api/project';

  const userStore = useUserStore();

  const props = defineProps({
    currentProject: {
      default: '',
      type: String,
    },
    currentCluster: {
      default: '',
      type: String,
    },
  });

  const groupStatusList = ref({});
  const groupItemWidth = ref('');
  const getTicketGroupStatusFunc = async () => {
    const res = await getTicketGroupStatus({
      cluster_type: props.currentCluster,
      project_name: props.currentProject,
    });
    groupStatusList.value = res.data.status;
    groupItemWidth.value = `calc(${
      100 / Object.keys(groupStatusList.value).length
    }% - 12px)`;
  };

  interface GroupStats {
    [key: string]: {
      [id: string]: {
        short_text: string;
        responsible_problem_solver_user: string;
      };
    };
  }

  interface GroupStatsNum {
    [key: string]: number;
  }

  const groupStats = ref<GroupStats>({});
  const groupStatsNum = ref<GroupStatsNum>({});
  const getTicketGroupStatsFunc = async () => {
    const res = await getTicketGroupStats({
      cluster_type: props.currentCluster,
      project_name: props.currentProject,
    });
    groupStats.value = res.data[props.currentCluster];
    groupStatsNum.value = res.data.status_total;
  };

  defineExpose({ getTicketGroupStatsFunc });

  onMounted(() => {
    getTicketGroupStatusFunc();
    getTicketGroupStatsFunc();
  });
</script>

<style scoped lang="less">
  .panelBox {
    width: 100%;
    width: calc(100% - 20px);
    margin: 16px 10px 0;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .header {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .headerItem {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f8f9;
    font-weight: bold;
    color: #626f86;
  }

  .contentBox {
    display: flex;
    justify-content: space-between;
  }

  .contentColumn {
    padding-bottom: 16px;
  }

  .ticketItem {
    padding: 20px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e4e7ed;
    margin-top: 16px;
    .topBox {
      line-height: 22px;
      .id {
        margin-right: 6px;
        background-color: #165dff;
        color: #fff;
        padding: 1px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
    }
    .name {
      color: #333;
      display: flex;
      margin-top: 8px;
      padding: 2px;
      font-size: 12px;
      align-items: center;
    }
  }
</style>
