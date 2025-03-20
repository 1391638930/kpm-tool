<template>
  <a-drawer
    :width="500"
    @ok="updateChart"
    @cancel="cancel"
    @before-open="beforeOpen"
    @close="close"
  >
    <template #title> {{ drawerTitle() }} </template>
    <div>
      <a-form ref="updateFormRef" :model="updateFormData" layout="vertical">
        <a-form-item
          field="chart_name"
          :rules="[{ required: true, message: 'Chart name is required' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label="Chart Name"
        >
          <a-input
            v-model="updateFormData.chart_name"
            placeholder="Please enter chart name"
          />
        </a-form-item>
        <a-form-item
          field="chart_type"
          :rules="[{ required: true, message: 'Chart type is required' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label="Chart Type"
        >
          <a-select
            v-model="updateFormData.chart_type"
            placeholder="Please select chart type"
          >
            <a-option value="bar">Bar Chart</a-option>
            <a-option value="pie">Pie Chart</a-option>
            <a-option value="line">Line Chart</a-option>
            <a-option value="stack_bar">Stack Bar Chart</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          field="data_source"
          :rules="[{ required: true, message: 'Data source is required' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label="Data Source"
        >
          <a-select
            v-model="updateFormData.data_source"
            placeholder="Please select data source"
          >
            <a-option v-for="item in dataSourceList" :value="item" :key="item">
              {{ item }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="
            updateFormData.chart_type == 'bar' ||
            updateFormData.chart_type == 'line' ||
            updateFormData.chart_type == 'stack_bar'
          "
          field="x_axis"
          :rules="[{ required: true, message: 'X axis is required' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label="X Axis"
        >
          <a-select
            v-model="updateFormData.x_axis"
            placeholder="Please select X axis"
          >
            <a-option v-for="item in groupFieldList" :value="item" :key="item">
              {{ item }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="
            updateFormData.chart_type == 'pie' ||
            updateFormData.chart_type == 'stack_bar'
          "
          field="legend"
          :rules="[{ required: true, message: 'Legend is required' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label="Legend"
        >
          <a-select
            v-model="updateFormData.legend"
            placeholder="Please select legend"
          >
            <a-option v-for="item in groupFieldList" :value="item" :key="item">
              {{ item }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          field="data"
          :rules="[{ required: true, message: 'Data is required' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label="Data"
        >
          <a-select
            v-model="updateFormData.data"
            placeholder="Please select data"
          >
            <a-option value="tickets_amount">Tickets Amount</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
  import {
    getDataSource,
    getGroupField,
    createChart,
    editChart,
  } from '@/api/dashboard';
  import { onMounted, ref } from 'vue';
  import type { FormInstance } from '@arco-design/web-vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'create',
    },
    editChartData: {
      type: Object,
      default: () => {},
    },
    dashboardInfo: {
      type: Object,
      default: () => {},
    },
    chartListLength: Number,
  });

  const emit = defineEmits(['cancelDrawer', 'createFinished']);

  const cancel = () => {
    emit('cancelDrawer');
  };

  const updateFormData = ref({
    chart_name: '',
    data_source: '',
    x_axis: '',
    legend: '',
    data: '',
    chart_type: '',
  });

  const dataSourceList = ref([]);
  const getDataSourceFunc = async () => {
    const res = await getDataSource();
    dataSourceList.value = res.data.filter_names;
  };

  const groupFieldList = ref([]);
  const getGroupFieldFunc = async () => {
    const res = await getGroupField();
    groupFieldList.value = res.data;
  };

  onMounted(() => {
    getDataSourceFunc();
    getGroupFieldFunc();
  });

  const beforeOpen = () => {
    console.log('chartListLength', props.chartListLength);
    // console.log('type', props.type, props.editChartData);
    updateFormData.value = JSON.parse(JSON.stringify(props.editChartData)) as {
      chart_name: string;
      data_source: string;
      x_axis: string;
      legend: string;
      data: string;
      chart_type: string;
    };
  };

  const drawerTitle = () => {
    let title = '';
    if (props.type === 'create') {
      title = `Create Chart`;
    } else if (props.type === 'edit') {
      title = `Edit Chart`;
    }
    return title;
  };

  const createFinished = () => {
    emit('cancelDrawer');
    emit('createFinished');
  };

  const updateFormRef = ref<FormInstance | null>(null);
  const updateChart = async () => {
    if (updateFormRef.value) {
      updateFormRef.value.validate().then(async (result) => {
        if (!result) {
          if (props.type === 'create') {
            const param = {
              dashboard_id: props.dashboardInfo.id,
              chart_name: updateFormData.value.chart_name,
              data_source: updateFormData.value.data_source,
              chart_type: updateFormData.value.chart_type,
              x_axis: updateFormData.value.x_axis,
              legend: updateFormData.value.legend,
              location_id: props.chartListLength,
            };
            await createChart(param);
            createFinished();
          } else if (props.type === 'edit') {
            const param = {
              chart_name: updateFormData.value.chart_name,
              data_source: updateFormData.value.data_source,
              chart_type: updateFormData.value.chart_type,
              x_axis: updateFormData.value.x_axis,
              legend: updateFormData.value.legend,
              location_id: props.editChartData.location_id,
            };
            await editChart(props.editChartData.id, param);
            createFinished();
          }
        }
      });
    }
  };

  const close = () => {
    updateFormRef.value?.resetFields();
  };
</script>

<style scoped lang="less"></style>
