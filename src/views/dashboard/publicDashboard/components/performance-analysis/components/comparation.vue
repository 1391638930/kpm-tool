<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '5px', paddingTop: '32px', justifyContent: 'center', height: 'fit-content' }"
  >
    <template #extra>
      <a-space direction="horizontal" size="medium">
        <a-row style="justify-content: space-between">
          <a-col :span="5">
            <a-form-item field="name" label="Version">
              <a-select
                :style="{ width: '20vw' }"
                @change="selectChange"
                v-model="versionSelect"
                multiple
                :default-value="options.version[0]"
              >
                <a-option
                  v-for="item of options.version"
                  :key="item"
                  :value="item"
                  :label="item"
                >
                  <a-tooltip :content="item">
                    <span>{{ item }}</span>
                  </a-tooltip>
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item field="name" label="Function">
              <a-select
                :style="{ width: '30vw' }"
                @change="(e) => selectChange(e, 'function')"
                v-model="funcSelect"
                multiple
                :default-value="options.function[0]"
                :allow-clear="true"
              >
                <template #header>
                  <div style="padding: 6px 12px;" >
                    <a-checkbox @change="functionSelecetAll" v-model="isAllFunctionSelected">Select All</a-checkbox>
                  </div>
                </template>
                <a-option
                  v-for="item of options.function"
                  :key="item"
                  :value="item"
                  :label="item"
                >
                  <a-tooltip :content="item">
                    <span>{{ item }}</span>
                  </a-tooltip>
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item field="name" label="Feature">
              <a-select
                :style="{ width: '20vw' }"
                @change="selectChange"
                v-model="featureSelcet"
                multiple
                :default-value="options.feature[0]"
                :allow-clear="true"
              >
                <template #header>
                  <div style="padding: 6px 12px;" >
                    <a-checkbox @change="featureSelecetAll" v-model="isAllFeatureSelected">Select All</a-checkbox>
                  </div>
                </template>
                <a-option
                  v-for="item of options.feature"
                  :key="item"
                  :value="item"
                  :label="item"
                >
                  <a-tooltip :content="item">
                    <span>{{ item }}</span>
                  </a-tooltip>
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-space>
    </template>
    <a-spin :loading="loading" style="width: 100%">
      <Chart
        ref="myChart"
        style="width: 100%; height: 447px"
        :option="chartOption"
        :key="chartKey"
      />
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch, computed } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    queryStatsForCompare,
    ContentVerifyRecord,
    queryFeatureByFunc
  } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';
  import { getCurrentDateTime } from '@/utils/utils';

  const myChart = ref(null);
  const versionSelect: any = ref([])
  const funcSelect: any = ref([])
  const featureSelcet: any = ref([])

  const props = defineProps({
    optionList: {
      type: Object,
      default() {
        return {};
      },
    },
    project: {
      type: String
    }
  });

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span>

          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">

        ${el.seriesName === 'VOKRate' ? `${el.value}%` : el.value}
        </span>
      </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const xAxis = ref<string[]>([]);
  const clusterValue = ref('Performance_Analysis');

  const { chartOption }: any = useChartOption((isDark) => {
    return {
      title: {
        text: 'Comparation',
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_Comparation_${getCurrentDateTime()}`,
            type: 'png',
            excludeComponents: ['dataZoom', 'toolbox'],
          },
        },
      },
      grid: {
        left: '40',
        right: '40',
        top: '90',
        bottom: '50',
        containLabel: true,
      },
      legend: {
        top: 45,
        icon: 'circle',
        textStyle: {
          color: '#4E5969',
        },
      },
      xAxis: {
        type: 'category',
        data: xAxis.value,
        boundaryGap: true,
        axisLine: {
          lineStyle: {
            color: isDark ? '#3f3f3f' : '#A9AEB8',
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          interval(idx: number) {
            if (idx === 0) return false;
            if (idx === xAxis.value.length - 1) return false;
            return true;
          },
        },
        axisLabel: {
          color: '#000000',
          interval: 0,
          rotate: 45,
          formatter: (value) => {
            if (value.length > 25) {
              return `${value.substring(0, 15)}...`;
            }
            return value;
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
            },
            show: true,
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter(params) {
          const newParams = params as ToolTipFormatterParams[];
          if (newParams.length === 0) {
            return '';
          }
          const barContentStr = `<div>
            <p class="tooltip-title">${newParams[0].axisValueLabel}</p>
            ${tooltipItemsHtmlString(newParams as ToolTipFormatterParams[])}
          </div>`;

          return barContentStr;
        },
        className: 'echarts-tooltip-diy',
      },
      series: [],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none',
          height: 14,
          start: 0,
          borderColor: 'transparent',
          handleSize: '20',
          handleStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 4,
          },
          brushSelect: false,
          backgroundColor: isDark ? '#313132' : '#F2F3F5',
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none',
          width: 14,
          start: 0,
          borderColor: 'transparent',
          handleSize: '20',
          handleStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 4,
          },
          brushSelect: false,
          backgroundColor: isDark ? '#313132' : '#F2F3F5',
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ],
      graphic: {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: '',
          fontSize: 20,
          fill: '#ccc',
        },
      },
    };
  });

  const chartKey = ref(0)

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryStatsForCompare(props.project!, versionSelect.value.toString(),
        funcSelect.value.toString(), featureSelcet.value.toString());
      chartOption.value.series = [];
      if (chartData.length === 0) {
        xAxis.value = [];
        chartOption.value.graphic.style.text = 'No Data';
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentVerifyRecord) => {
          chartOption.value.series?.push({
            zlevel: 2,
            name: el.name,
            data: el.y,
            type: 'line',
            barMaxWidth: 50,
            smooth: true,
            emphasis: {
              focus: 'series',
              itemStyle: {
                borderWidth: 2,
                borderColor: '#E0E3FF',
              },
            },
          })
        });
      }
    } catch (err) {
      chartOption.value.graphic.style.text = 'No Data';
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
    chartKey.value += 1
  };

  type CommonList = {
    version: Array<string>,
    function: Array<string>,
    feature: Array<string>
  }
  let options: CommonList = reactive({
    version: [],
    function: [],
    feature: []
  })
  const selectChange = async (e: any, type?: string) => {
    if (type === 'function') {
      console.log(e)
      const data = await queryFeatureByFunc(props.project!, e.join())
      console.log(data)
      if (data.data.length) {
        options.feature = data.data
        featureSelcet.value = [options.feature[0]]
      } else {
        options.feature = []
        featureSelcet.value = ['']
      }
    }
    fetchData();
  };

  const isAllFunctionSelected = computed(() => {
    return funcSelect.value.length === options.function.length
  })
  const functionSelecetAll = () => {
    if (isAllFunctionSelected.value) {
      funcSelect.value = []
    } else {
      funcSelect.value = [...options.function]
    }
    fetchData()
  }

  const isAllFeatureSelected = computed(() => {
    return featureSelcet.value.length === options.feature.length
  })
  const featureSelecetAll = () => {
    console.log(isAllFeatureSelected.value)
    if (isAllFeatureSelected.value) {
      featureSelcet.value = []
    } else {
      featureSelcet.value = [...options.feature]
    }
    fetchData()
  }
  watch(
    () => props.optionList,
    (newValue: any) => {
      options = newValue
      versionSelect.value = [newValue.version[0] || '']
      const [ func ] = newValue.function || ''
      funcSelect.value = func
      selectChange([func], 'function')
    }, {
      immediate: true,
      deep: true
    }
  );
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
  :deep(.arco-select-view-inner) {
    overflow-x: auto;
  }
</style>
