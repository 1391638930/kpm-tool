<template>
  <div class="dashboardDetail">
    <div v-if="!isInfoValid()" class="createDashboardBox">
      <div class="createDashboardBtn" @click="createDashboard">
        <icon-plus class="plusIcon" />
        <p>Click to create dashboard</p>
      </div>
    </div>
    <template v-if="isInfoValid()">
      <!-- {{ props.info }} -->
      <div v-if="Object.keys(chartList).length === 0" class="createChartBtnBox">
        <div class="createChartBtn" @click="openCreateSelectTypeDrawer">
          <icon-plus class="plusIcon" />
          <p>Click above button to add charts</p>
        </div>
      </div>
      <div class="chartBox">
        <el-scrollbar>
          <draggable
            v-if="draggableFlag"
            :list="chartList"
            class="chartsDraggable"
            ghost-class="ghost"
            :animation="300"
            item-key="location_id"
            @sort="draggableSort"
            handle=".chartsHandle"
          >
            <template #item="{ element, index }">
              <div class="chartItem" :key="index">
                <div class="chartsHandle"></div>
                <div
                  class="chartsEdit"
                  @click="openEditChartDrawer(element)"
                ></div>
                <!-- <div class="chartsId">
                  ID:{{ element.location_id }} {{ index }}
                </div> -->
                <chartContent :data="element" />
              </div>
            </template>
          </draggable>
        </el-scrollbar>
      </div>
    </template>
    <a-drawer
      :width="600"
      @ok="selectTypeDrawerVisible = false"
      @cancel="selectTypeDrawerVisible = false"
      :visible="selectTypeDrawerVisible"
      :footer="false"
      unmountOnClose
    >
      <template #title> Select chart type </template>
      <div class="createChartDrawer">
        <div
          v-for="(item, key) in chartsTypeList"
          :key="key"
          :class="{
            createChartTypeBox: true,
            [item.node]: true,
          }"
          @click="selectChartType(item.index)"
        >
          <div class="createChartTypeImage"></div>
          <div class="createChartTypeInfo">
            <div class="createChartTypeTitle">{{ item.name }}</div>
            <div class="createChartTypeDescription">
              {{ item.Description }}
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
    <chartUpdateDrawer
      :visible="updateChartVisible"
      :type="updateChartDrawerType"
      :editChartData="editChartData"
      :dashboardInfo="props.info"
      :chartListLength="chartList.length"
      @cancelDrawer="cancelChartUpdateDrawer"
      @createFinished="createChartFinished"
    />
  </div>
</template>

<script lang="ts" setup>
  import { getDashboardChart, getChartData, editChart } from '@/api/dashboard';
  import { onMounted, watch, ref, provide } from 'vue';
  import draggable from 'vuedraggable';
  import chartUpdateDrawer from './chart-update-drawer.vue';
  import chartContent from './chart-content.vue';

  const props = defineProps({
    info: {
      type: Object,
      default: () => {},
    },
  });

  const emit = defineEmits(['createDashboard']);

  const isInfoValid = () => {
    return Object.keys(props.info).length;
  };

  const draggableFlag = ref(false);
  const chartList = ref<any[]>([]);
  const getChartDataFunc = async (chart: any, resolve: any) => {
    const param = {
      chart_id: chart.id,
    };
    await getChartData(param).then((res) => {
      chartList.value[chart.location_id] = {
        location_id: chart.location_id,
        info: chart,
        data: res.data,
      };
      resolve();
    });
  };

  const getChartIdList = async (dashboardId: number) => {
    // console.log('dashboardId', dashboardId);
    draggableFlag.value = false;

    const param = {
      dashboard_id: dashboardId,
    };
    await getDashboardChart(param).then((res) => {
      const promiseAllArr: Promise<any>[] = [];
      res.data?.list.forEach((item: any) => {
        promiseAllArr.push(
          new Promise((resolve) => {
            getChartDataFunc(item, resolve);
          })
        );
      });
      Promise.all(promiseAllArr).then(() => {
        draggableFlag.value = true;
        console.log('chartList.value', chartList.value);
      });
    });
  };

  watch(
    () => props.info,
    async (newValue: any, oldValue: any) => {
      console.log('newValue', newValue);
      // console.log('oldValue', oldValue);
      if (newValue.id) {
        await getChartIdList(newValue.id);
      }
    }
  );

  onMounted(async () => {
    console.log('info', props.info);
    await getChartIdList(props.info.id);
  });

  const createDashboard = () => {
    emit('createDashboard');
  };

  const chartsTypeList = ref([
    {
      name: 'Bar Chart',
      node: 'barChart',
      index: 'bar',
      Description: 'Compares quantities across different categories visually',
    },
    {
      name: 'Pie Chart',
      node: 'pieChart',
      index: 'pie',
      Description: 'Displays parts of a whole as slices',
    },
    {
      name: 'Line Chart',
      node: 'lineChart',
      index: 'line',
      Description: 'Shows trends over time or intervals using connected points',
    },
    {
      name: 'Stack Bar Chart',
      node: 'stackBarChart',
      index: 'stack_bar',
      Description: 'Shows total values and their components in bars',
    },
  ]);

  const updateChartVisible = ref(false);
  const updateChartDrawerType = ref('create');
  const editChartData = ref({});
  const selectChartType = (type: string) => {
    editChartData.value = {
      chart_type: type,
      data: 'tickets_amount',
    };
    updateChartVisible.value = true;
  };

  const selectTypeDrawerVisible = ref(false);
  const openCreateSelectTypeDrawer = () => {
    updateChartDrawerType.value = 'create';
    selectTypeDrawerVisible.value = true;
  };
  defineExpose({ openCreateSelectTypeDrawer });

  const cancelChartUpdateDrawer = () => {
    updateChartVisible.value = false;
  };

  const createChartFinished = async () => {
    cancelChartUpdateDrawer();
    selectTypeDrawerVisible.value = false;
    await getChartIdList(props.info.id);
  };

  const draggableSort = async (e: any) => {
    console.log('e', e);
    // console.log("cardlist", cardList.value);
    const newIndex = e.newIndex;
    const oldIndex = e.oldIndex;
    const draggedCard = chartList.value[newIndex];
    console.log('draggedCard', draggedCard);
    const param = {
      chart_name: draggedCard.info.chart_name,
      data_source: draggedCard.info.data_source,
      chart_type: draggedCard.info.chart_type,
      x_axis: draggedCard.info.x_axis,
      legend: draggedCard.info.legend,
      location_id: newIndex,
    };
    await editChart(draggedCard.info.id, param);
    await getChartIdList(props.info.id);
  };

  const openEditChartDrawer = (element: any) => {
    console.log('element', element);
    updateChartDrawerType.value = 'edit';
    editChartData.value = {
      chart_name: element.info.chart_name,
      data_source: element.info.data_source,
      x_axis: element.info.group_by,
      legend: element.info.group_by,
      data: 'tickets_amount',
      chart_type: element.info.chart_type,
      location_id: element.location_id,
      id: element.info.id,
    };
    updateChartVisible.value = true;
  };
</script>

<style scoped lang="less">
  .dashboardDetail {
    width: 100%;
    height: 100%;
  }

  .createDashboardBox,
  .createChartBtnBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .createDashboardBtn,
  .createChartBtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 30px;
  }

  .plusIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-neutral-4);
    border: 12px solid var(--color-neutral-4);
    border-radius: 30px;
    font-size: 150px;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 5;
    padding: 6px;
  }

  .createDashboardBtn > p,
  .createChartBtn > p {
    font-size: 23px;
    color: var(--color-neutral-5);
    font-weight: bold;
  }

  .chartBox {
    height: 100%;
    width: 100%;
  }

  .chartsDraggable {
    display: flex;
    flex-wrap: wrap;
    // height: 100%;
    width: 100%;
    padding-right: 16px;
    box-sizing: border-box;
  }

  .chartItem {
    border: 1px solid var(--color-border);
    margin-right: 16px;
    margin-bottom: 16px;
    position: relative;
    height: fit-content;
    transition: all 0.2s;
    width: calc(33.3% - 10.67px);
    height: 300px;
  }

  .chartItem:nth-child(3n) {
    margin-right: 0;
  }

  .chartItem.ghost {
    background-color: var(--color-neutral-2);
  }

  .chartsHandle,
  .chartsEdit {
    content: '';
    position: absolute;
    background-image: url(@/assets/images/handle.svg);
    height: 20px;
    width: 20px;
    left: 0;
    top: 0;
    background-size: cover;
    cursor: all-scroll;
    z-index: 10;
  }

  .chartsEdit {
    height: 16px;
    width: 16px;
    background-image: url(@/assets/images/edit.svg);
    top: 2px;
    left: 30px;
    cursor: pointer;
  }

  .chartsId {
    position: absolute;
    /* user-select: none; */
    color: #aaa;
    left: 5px;
    bottom: 5px;
    font-size: 12px;
    z-index: 10;
  }

  .createChartDrawer {
    overflow-x: hidden;
  }

  .createChartTypeBox {
    width: 100%;
    height: 200px;
    margin-bottom: 16px;
    display: flex;
    cursor: pointer;
    transition: all 0.2s;
  }

  .createChartTypeBox:hover {
    transform: scale(1.05);
  }

  .createChartTypeImage {
    width: 200px;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80%;
    flex-shrink: 0;
  }

  .createChartTypeBox.barChart .createChartTypeImage {
    background-image: url('@/assets/images/bar-chart.png');
  }

  .createChartTypeBox.pieChart .createChartTypeImage {
    background-image: url('@/assets/images/pie-chart.png');
  }

  .createChartTypeBox.lineChart .createChartTypeImage {
    background-image: url('@/assets/images/line-chart.png');
  }

  .createChartTypeBox.stackBarChart .createChartTypeImage {
    background-image: url('@/assets/images/stack-bar-chart.png');
  }

  .createChartTypeInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    max-width: calc(100% - 200px);
    margin-left: 16px;
  }

  .createChartTypeTitle {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 16px;
  }
</style>
