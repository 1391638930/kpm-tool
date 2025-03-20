<template>
  <div class="dashboardList">
    <el-table
      class="table"
      :data="dashboardData"
      border
      @row-click="tableRowClick"
    >
      <el-table-column
        prop="name"
        label="Dashboard Name"
        class-name="dashboardNameColumn"
      />
      <el-table-column prop="visibility" label="Visibility" />
      <el-table-column prop="creator_user" label="Creator" />
      <el-table-column prop="description" label="Description" />
      <el-table-column label="Action" width="180">
        <template #default="scope">
          <el-button type="success" link @click.stop="editDashboard(scope.row)">
            Edit
          </el-button>
          <a-popconfirm
            content="Are you sure you want to delete?"
            @ok="deleteDashboardFunc(scope.row)"
            position="br"
          >
            <el-button type="danger" link @click.stop> Delete </el-button>
          </a-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="total, sizes, prev, pager, next"
      :total="totalNum"
      @current-change="getDashboard"
      @size-change="getDashboard"
    />
  </div>
</template>

<script lang="ts" setup>
  import { queryMyDashboardList, deleteDashboard } from '@/api/dashboard';
  import { onMounted, ref } from 'vue';

  const emit = defineEmits([
    'editDashboard',
    'deleteDashboard',
    'viewDashboardRow',
  ]);

  const pageSize = ref(20);
  const currentPage = ref(1);
  const totalNum = ref(0);
  const dashboardData = ref([]);
  const getDashboard = async () => {
    const param = {
      pageSize: pageSize.value,
      current: currentPage.value,
    };
    const res = await queryMyDashboardList(param);
    dashboardData.value = res.data.list;
    totalNum.value = res.data.total;
  };

  defineExpose({ getDashboard });

  onMounted(async () => {
    await getDashboard();
  });

  const editDashboard = async (row: any) => {
    emit('editDashboard', row);
  };
  const deleteDashboardFunc = async (row: any) => {
    await deleteDashboard(row.id);
    await getDashboard();
  };

  const tableRowClick = (row: any, index: any) => {
    if (index.property === 'name') {
      emit('viewDashboardRow', row);
    }
  };
</script>

<style scoped lang="less">
  .dashboardList {
    width: 100%;
    height: 100%;
  }

  .table {
    height: calc(100% - 44px);

    :deep(.dashboardNameColumn) {
      cursor: pointer;
    }
  }

  .pagination {
    float: right;
    margin-top: 12px;
  }
</style>
