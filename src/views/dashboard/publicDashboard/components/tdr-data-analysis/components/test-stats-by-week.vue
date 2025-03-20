<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('tdrDataAnalysis.systemTdrStats') }}
      </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-form-item field="name" label="Cluster">
            <a-select
              v-model="clusterValue"
              :style="{ width: '220px' }"
              placeholder="Cluster Type"
              @change="selectChange"
            >
              <a-option
                v-for="item of clusterArray"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </a-select>
          </a-form-item>
        </a-space>
      </template>
      <Chart
        ref="myChart"
        style="width: 100%; height: 497px"
        :option="chartOption"
      />
      <!-- <button @click="downloadChart">下载图表</button> -->
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    ContentSystemTdrRecord,
    querySystemQuoteByTdr,
  } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';

  import { getCurrentDateTime } from '@/utils/utils';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>

          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value}
        </span>
      </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const clusterValue = ref('CL46');
  const clusterArray = [

    {
      label: 'CL46',
      value: 'CL46',
    },
    {
      label: 'CL43',
      value: 'CL43',
    },
    {
      label: 'CL3D',
      value: 'CL3D',
    },
    {
      label: 'CL3B',
      value: 'CL3B',
    },
    {
      label: 'CL3A',
      value: 'CL3A',
    },
    {
      label: 'CL39',
      value: 'CL39',
    },
    {
      label: 'CL37',
      value: 'CL37',
    },
    {
      label: 'CL35.2',
      value: 'CL35.2',
    },
    {
      label: 'CL35',
      value: 'CL35',
    },
  ];

  const xAxis = ref<string[]>([]);
  const blackScreenMapChartsData = ref<number[]>([]);
  const systemResetChartsData = ref<number[]>([]);
  const benchTestTimeChartsData = ref<number[]>([]);
  const carTestTimeChartsData = ref<number[]>([]);
  const weeklyTestMileChartsData = ref<number[]>([]);
  const resetPerMileChartsData = ref<number[]>([]);
  const resetPerHourChartsData = ref<number[]>([]);
  // const yInterval = ref<number>(10);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Bench/Car Weekly Usage`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_Bench/Car_Weekly_Usage_${getCurrentDateTime()}`,
            type: 'png',
            excludeComponents: ['dataZoom', 'toolbox'],
          },
        },
      },
      grid: {
        left: '40',
        right: '40',
        top: '40',
        bottom: '50',
        containLabel: true,
      },
      legend: {
        bottom: 30,
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
          // lineStyle: {
          //   color: '#86909C',
          // },
          interval(idx: number) {
            if (idx === 0) return false;
            if (idx === xAxis.value.length - 1) return false;
            return true;
          },
        },
        axisLabel: {
          // formatter(value: number, idx: number) {
          //   if (idx === 0) return '';
          //   if (idx === xAxis.value.length - 1) return '';
          //   return `${value}`;
          // },
          color: '#000000',
          interval: 0,
          rotate: 40,
        },
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              // color: isDark ? '#3F3F3F' : '#E5E6EB',
            },
            show: false,
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
          },
        },
        {
          type: 'value',
          // interval: yInterval.value,
          // min: -yInterval.value,
          min: -100,
          yAxisIndex: 1,
          splitLine: {
            lineStyle: {
              // color: isDark ? '#3F3F3F' : '#E5E6EB',
            },
            show: true,
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            // formatter: '{value}',
            formatter(value: number) {
              if (value < 0) {
                // 如果标签值是负数，就返回空字符串
                return '';
              }
              // 否则，就返回标签值本身
              return value;
            },
            color: '#000000',
          },
        },
      ],
      // 提示框取默认值，即鼠标移动到柱状图会显示内容
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'cross',
      //     crossStyle: {
      //       color: '#999',
      //     },
      //   },
      //   formatter(params) {
      //     const [firstElement, second, third, last] =
      //       params as ToolTipFormatterParams[];

      //     const barContentStr = `<div>
      //       <p class="tooltip-title">${firstElement.axisValueLabel}</p>
      //       ${tooltipItemsHtmlString([
      //         firstElement,
      //         second,
      //         third,
      //       ] as ToolTipFormatterParams[])}
      //     </div>`;

      //     const triggerStr = `<div class="content-panel">
      //     <p>
      //     <span style="background-color: ${last.color}" class="tooltip-item-icon"></span>

      //     <span style="margin-right: 20px;">${last.seriesName}</span>
      //     </p>
      //     <span class="tooltip-value">
      //     ${last.value}
      //     </span>
      //     </div>`;

      //     return barContentStr + triggerStr;
      //   },
      //   className: 'echarts-tooltip-diy',
      // },
      series: [
        {
          name: 'Bench Test time',
          zlevel: 2,
          data: benchTestTimeChartsData.value,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          color: '#4A7D31',
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          // color: '#FFDF7D',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#D9F6FF',
            },
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              return params.data === 0 ? '' : params.data;
            },
            fontSize: 10,
          },
        },
        {
          name: 'Car Test time',
          zlevel: 2,
          data: carTestTimeChartsData.value,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          color: '#962E35',
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          // color: '#FFEAA8',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#D9F6FF',
            },
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              return params.data === 0 ? '' : params.data;
            },
            fontSize: 10,
          },
        },
        {
          name: 'Weekly Test mileage',
          data: weeklyTestMileChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          color: '#EDD996',
          zlevel: 3,
          smooth: true,
          symbolSize: 5,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#D9F6FF',
            },
          },
          label: {
            show: true,
            position: 'left',
            // formatter: '{c}',
            formatter: (params: any) => {
              return params.data === 0 ? '' : params.data;
            },
          },
        },
      ],
      dataZoom: [
        {
          bottom: 0,
          type: 'slider',
          left: 65,
          right: 65,
          height: 14,
          color: '#F2D88C',
          start: 30,
          // textStyle: true,
          borderColor: 'transparent',
          handleSize: '20',
          handleStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 4,
          },
          brushSelect: false,
          // labelFormatter: (value) => {
          //   console.log("labelFormatter", value)
          // },
          backgroundColor: isDark ? '#313132' : '#F2F3F5',
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
        },
      ],
    };
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await querySystemQuoteByTdr(
        clusterValue.value
      );
      if (chartData.length === 0) {
        xAxis.value = [];
        blackScreenMapChartsData.value = [];
        systemResetChartsData.value = [];
        resetPerHourChartsData.value = [];
        resetPerMileChartsData.value = [];
        weeklyTestMileChartsData.value = [];
        benchTestTimeChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentSystemTdrRecord) => {
          if (el.name === 'Weekly Test mile age') {
            weeklyTestMileChartsData.value = el.y;
          } else if (el.name === 'Bench Test time') {
            benchTestTimeChartsData.value = el.y;
          } else if (el.name === 'Car Test time') {
            carTestTimeChartsData.value = el.y;
          }
        });
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const selectChange = () => {
    fetchData();
  };

  fetchData();
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
