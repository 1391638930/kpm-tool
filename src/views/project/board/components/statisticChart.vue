<template>
  <div class="statisticBox">
    <div class="header">
      <div class="title">In / Out Tickets Statistics</div>
      <a-button type="outline" @click="addExpectVisible = true">
        {{ $t('menu.project.addLineBtn') }}
      </a-button>
      <a-modal
        v-model:visible="addExpectVisible"
        title-align="start"
        :on-before-ok="addExpectDataFunc"
        @cancel="addExpectVisible = false"
      >
        <template #title> Add Expect Data </template>
        <div>
          <a-form :model="addExpectForm" layout="vertical" auto-label-width>
            <a-form-item field="weekNum" label="Week Num">
              <a-select v-model="addExpectForm.weekNum" placeholder="Week Num">
                <a-option v-for="(item, key) in weekRange" :key="key">
                  {{ item }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="value" label="Value">
              <a-input-number
                v-model="addExpectForm.value"
                placeholder="Value"
              />
            </a-form-item>
          </a-form>
        </div>
      </a-modal>
    </div>
    <Chart class="chart" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import * as echarts from 'echarts';
  import { useUserStore } from '@/store';
  import { addExpectData, getStatistic, getWeekRange } from '@/api/project';

  const userStore = useUserStore();

  const { loading, setLoading } = useLoading(true);

  const props = defineProps({
    currentProject: {
      type: String,
    },
    currentCluster: {
      type: String,
    },
  });

  const xAxis = ref<string[]>([]);

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
  const { chartOption }: any = useChartOption((isDark) => {
    return {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: 'png',
            excludeComponents: ['dataZoom', 'toolbox'],
          },
        },
      },
      grid: {
        left: '40',
        right: '40',
        top: '45',
        bottom: '10',
        containLabel: true,
      },
      legend: {
        top: 0,
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
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {},
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

  const updateStatistic = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await getStatistic({
        cluster_type: props.currentCluster,
        project_name: props.currentProject,
      });
      if (chartData.length === 0) {
        xAxis.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: any) => {
          let lineColor = '';
          let lineType = '';
          if (el.name === 'In') {
            lineColor = '#37C6AB';
            lineType = 'solid';
          } else if (el.name === 'Out') {
            lineColor = '#02A7F0';
            lineType = 'solid';
          } else if (el.name === 'Trend') {
            lineColor = '#8250DF';
            lineType = 'dashed';
          }
          chartOption.value.series?.push({
            zlevel: 2,
            name: el.name,
            data: el.y,
            type: 'line',
            barMaxWidth: 50,
            smooth: true,
            lineStyle: {
              color: lineColor,
              width: 4,
              type: lineType,
            },
            itemStyle: {
              borderWidth: 2,
              color: lineColor,
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                borderWidth: 2,
                borderColor: '#E0E3FF',
              },
            },
            areaStyle:
              el.name === 'Trend'
                ? null
                : {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: `${lineColor}CC`,
                      },
                      {
                        offset: 1,
                        color: '#ffffff33',
                      },
                    ]),
                  },
          });
        });
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  onMounted(() => {
    updateStatistic();
  });

  const weekRange = ref([]);
  const getWeekRangeFunc = async () => {
    const res = await getWeekRange({
      cluster_type: props.currentCluster,
      project_name: props.currentProject,
    });
    weekRange.value = res.data;
  };
  onMounted(() => {
    getWeekRangeFunc();
  });

  defineExpose({ updateStatistic, getWeekRangeFunc });

  const addExpectVisible = ref(false);
  const addExpectForm = ref({
    weekNum: '',
    value: undefined,
  });
  const addExpectDataFunc = async () => {
    await addExpectData({
      project: props.currentProject,
      week: addExpectForm.value.weekNum,
      cluster_type: props.currentCluster,
      value: addExpectForm.value.value,
    });
    addExpectForm.value = {
      weekNum: '',
      value: undefined,
    };
    updateStatistic();
  };
</script>

<style scoped lang="less">
  .statisticBox {
    height: 460px;
    width: calc(100% - 20px);
    margin: 10px 10px 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    height: 32px;
    margin-bottom: 10px;
    .title {
      font-weight: bold;
      font-size: 16px;
    }
  }

  .chart {
    height: calc(100% - 42px) !important;
  }
</style>
