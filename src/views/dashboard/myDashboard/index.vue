<template>
  <div class="container">
    <Breadcrumb :items="['menu.dashboard', 'menu.dashboard.myDashboard']" />
    <div class="myDashboardBox">
      <div class="header">
        <div></div>
        <div>
          <a-button
            v-if="pageType == 'list'"
            type="primary"
            @click="openCreateDashboardDialog"
          >
            Create Dashboard
          </a-button>
          <a-button
            v-if="pageType == 'detail'"
            type="primary"
            style="margin-left: 16px"
            @click="openCreateSelectTypeDrawer"
          >
            Create Chart
          </a-button>
          <a-button
            v-if="pageType == 'detail'"
            type="primary"
            style="margin-left: 16px"
            @click="viewAllDashboard"
          >
            View All Dashboard
          </a-button>
        </div>
      </div>
      <div class="content">
        <DashboardDetail
          ref="dashboardDetailRef"
          v-if="pageType == 'detail'"
          :info="currentDetail"
          @createDashboard="openCreateDashboardDialog"
        />
        <DashboardList
          ref="dashboardListRef"
          v-if="pageType == 'list'"
          @editDashboard="openEditDashboardDialog"
          @viewDashboardRow="viewSpecifiedDashboard"
        />
      </div>
    </div>
    <DashboardUpdateDialog
      :visible="updateDialogVisible"
      :type="updateDialogType"
      :editDashboardData="editDashboardData"
      @cancelDialog="dialogCancel"
      @updateDashboardList="dialogUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
  import { editDashboard, queryMyDashboardList } from '@/api/dashboard';
  import { onMounted, ref } from 'vue';
  import type { FormInstance } from '@arco-design/web-vue';
  import DashboardDetail from './components/dashboard-detail.vue';
  import DashboardList from './components/dashboard-list.vue';
  import DashboardUpdateDialog from './components/dashboard-update-dialog.vue';

  onMounted(async () => {
    await getDashboard();
  });

  const currentDetail = ref({});

  const pageSize = ref(20);
  const currentPage = ref(1);
  const getDashboard = async () => {
    const param = {
      pageSize: pageSize.value,
      current: currentPage.value,
    };
    const res = await queryMyDashboardList(param);
    if (res.data?.list.length > 0) {
      currentDetail.value = res.data.list[0];
    } else {
      currentDetail.value = {};
    }
  };

  // list && detail
  const pageType = ref('list');

  const updateDialogVisible = ref(false);
  const updateDialogType = ref('create');

  const openCreateDashboardDialog = () => {
    updateDialogType.value = 'create';
    updateDialogVisible.value = true;
  };

  const editDashboardData = ref({});
  const openEditDashboardDialog = (row: any) => {
    updateDialogType.value = 'edit';
    updateDialogVisible.value = true;
    editDashboardData.value = row;
  };

  const viewAllDashboard = async () => {
    pageType.value = 'list';
  };

  interface ExtendedFormInstance extends FormInstance {
    getDashboard: () => void;
    openCreateSelectTypeDrawer: () => void;
  }
  const dashboardListRef = ref<ExtendedFormInstance | null>(null);
  const dialogUpdate = () => {
    getDashboard();
    if (dashboardListRef.value) {
      dashboardListRef.value.getDashboard();
    }
  };

  const dashboardDetailRef = ref<ExtendedFormInstance | null>(null);
  const openCreateSelectTypeDrawer = () => {
    if (dashboardDetailRef.value) {
      dashboardDetailRef.value.openCreateSelectTypeDrawer();
    }
  };

  const dialogCancel = () => {
    updateDialogVisible.value = false;
    editDashboardData.value = {};
  };

  const viewSpecifiedDashboard = (row: any) => {
    currentDetail.value = row;
    pageType.value = 'detail';
  };
</script>

<script lang="ts">
  export default {
    name: 'My Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 0 20px;
    height: calc(100vh - 133px);
  }

  .myDashboardBox {
    height: calc(100% - 56px);
    background-color: var(--color-bg-1);
    box-shadow: 0 0 20px var(--color-neutral-3);
    border-radius: 5px;
    padding: 20px;
    box-sizing: border-box;
  }

  .header {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-neutral-2);
    display: flex;
    justify-content: space-between;
  }

  .content {
    height: calc(100% - 57px);
  }
</style>
