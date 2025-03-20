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
  const resetPerMileChartsData = ref<number[]>([]);
  const resetPerHourChartsData = ref<number[]>([]);
  // const yInterval = ref<number>(10);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} System Stability Status`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_System_Stability_Status_${getCurrentDateTime()}`,
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
          min: 0,
          interval: 5,
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
            formatter(value: number) {
              return value.toFixed(2); // 保留两位小数
            },
            color: '#000000',
          },
        },
        {
          type: 'value',
          // interval: yInterval.value,
          min: -0.1,
          // interval: 0.05,
          // min: -yInterval.value,
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
            formatter(value: number) {
              if (value < 0) {
                // 如果标签值是负数，就返回空字符串
                return '';
              }
              // 否则，就返回标签值本身
              return value.toFixed(2);
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
          zlevel: 2,
          name: 'Black Screen/Map',
          data: blackScreenMapChartsData.value,
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#3D72F6' : '#246EFF',
          color: '#FF6262',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E0E3FF',
            },
          },
          label: {
            show: true,
            position: 'insideBottom',
            formatter: (params: any) => {
              return params.data === 0 ? '' : params.data;
            },
            fontSize: 10,
          },
        },
        {
          name: 'System reset',
          zlevel: 2,
          data: systemResetChartsData.value,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          color: '#FFA7A7',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
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
          name: 'Reset/100km',
          data: resetPerMileChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          color: '#B7DEE8',
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
        {
          name: 'Reset/h',
          data: resetPerHourChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          color: '#92D050',
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
            // formatter: (params) => {
            //   if (params.value === 0) {
            //     return '';
            //   }
            //   return params.value;
            // },
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
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentSystemTdrRecord) => {
          if (el.name === 'Black Screen/Map') {
            blackScreenMapChartsData.value = el.y;
          } else if (el.name === 'System reset') {
            systemResetChartsData.value = el.y;
          } else if (el.name === 'Reset/h') {
            resetPerHourChartsData.value = el.y;
          } else if (el.name === 'Reset/100km') {
            resetPerMileChartsData.value = el.y;
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
