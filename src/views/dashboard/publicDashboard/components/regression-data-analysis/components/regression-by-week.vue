<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('regressionDataAnalysis.weekDimension') }}
      </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-form-item field="name" label="Cluster">
            <a-select
              v-model="clusterValue"
              :style="{ width: '220px' }"
              placeholder="Cluster Type"
              @change="clusterChange"
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
        style="width: 100%; height: 447px"
        :option="chartOption"
        @click-chart="handleClickChart"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryTicketByWeek, ContentTicketRecord } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';
  import { getCurrentDateTime } from '@/utils/utils';
  import { useTabBarStore } from '@/store';

  // const chartTheme = ref('customed');
  // echarts.init(chartRef, 'customed');
  import { useRouter } from 'vue-router';

  const router = useRouter();
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

        ${el.seriesName === 'regRate' ? `${el.value}%` : el.value}
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
  const regChartsData = ref<number[]>([]);
  const normalChartsData = ref<number[]>([]);
  // const totalChartsData = ref<number[]>([]);
  const regRateChartsData = ref<number[]>([]);
  // const imgChartsData = ref<number[]>([]);
  // const videoChartsData = ref<number[]>([]);

  const tabBarStore = useTabBarStore();
  const handleClickChart = (params: any) => {
    let dataKind = 'all';
    if (params.componentIndex === 0) {
      dataKind = 'normal';
    } else if (params.componentIndex === 1) {
      dataKind = 'regression';
    }
    const queryParams = {
      clusterType: clusterValue.value,
      week: params.name,
      classify: dataKind,
    };
    tabBarStore.deleteTagByName('KpmList');
    router.push({ name: 'KpmList', query: queryParams });
  };

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Weekly Regression Ticket`,
        left: 'center',
        fontWeight: 'bolder',
      },
      grid: {
        left: '40',
        right: '40',
        top: '50',
        bottom: '50',
        containLabel: true,
      },
      legend: {
        bottom: 30,
        icon: 'circle',
        textStyle: {
          color: '#4E5969',
        },
        data: ['regression', 'normal', 'regRate'],
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: 'png',
            name: `${
              clusterValue.value
            }_Weekly_Regression_Ticket_${getCurrentDateTime()}`,
            excludeComponents: ['dataZoom', 'toolbox'],
          },
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
          color: '#000000',
          // formatter(value: number, idx: number) {
          //   if (idx === 0) return '';
          //   if (idx === xAxis.value.length - 1) return '';
          //   return `${value}`;
          // },
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
            color: '#000000',
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: 'regRate',
          min: -100,
          max: 100,
          interval: 20,
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
            color: '#000000',
            formatter: '{value}%',
            show: false,
          },
        },
      ],
      // 提示框取默认值，即鼠标移动到柱状图会显示内容
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
      series: [
        {
          name: 'normal',

          zlevel: 2,
          data: normalChartsData.value,
          stack: 'verify',
          type: 'bar',
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#3D72F6' : '#246EFF',
          color: '#4A7D31',
          symbol: 'circle',
          symbolSize: 10,
          label: {
            show: true,
            position: 'inside',
            fontSize: 10,
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E0E3FF',
            },
          },
        },

        {
          name: 'regression',
          stack: 'verify',
          data: regChartsData.value,

          zlevel: 2,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          type: 'bar',
          smooth: true,
          showSymbol: false,
          label: {
            show: true,
            position: 'inside',
            fontSize: 10,
          },
          // color: isDark ? '#A079DC' : '#00B2FF',
          color: '#F2D88C',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
        },

        {
          name: 'regRate',
          data: regRateChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          zlevel: 2,
          color: '#A6A6A6',
          smooth: true,
          // showSymbol: true,
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          // symbol: 'circle',
          // markLine: {
          //   // name: '警戒线',
          //   // symbol: 'none',
          //   silent: false,
          //   label: {
          //     position: 'start',
          //     formatter: 'VOK达标',
          //   },
          //   data: [
          //     {
          //       type: 'average',
          //       silent: false,
          //       lineStyle: {
          //         type: 'solid',
          //         color: 'red',
          //       },
          //       yAxis: 80,
          //     },
          //   ],
          // },
          symbolSize: 5,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#D9F6FF',
            },
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
          },
          markLine: {
            // name: '警戒线',
            // symbol: 'none',
            silent: false,
            label: {
              position: 'start',
              formatter: '{c} %',
            },
            data: [
              {
                zlevel: 1,
                type: 'average',
                silent: false,
                lineStyle: {
                  type: 'solid',
                  color: 'red',
                },
                yAxis: 80,
              },
            ],
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
          borderColor: 'transparent',
          start: 45,
          end: 100,
          // handleIcon:
          //   'image://http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/1ee5a8c6142b2bcf47d2a9f084096447.svg~tplv-49unhts6dw-image.image',
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
          // start: 0,
          // end: 100,
          zoomOnMouseWheel: false,
        },
      ],
    };
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryTicketByWeek(clusterValue.value);
      if (chartData.length === 0) {
        xAxis.value = [];
        regChartsData.value = [];
        normalChartsData.value = [];
        // totalChartsData.value = [];
        regRateChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentTicketRecord) => {
          // console.log(el, 'hehhe');
          if (el.name === 'Regression') {
            regChartsData.value = el.y;
          } else if (el.name === 'Normal') {
            normalChartsData.value = el.y;
          } else if (el.name === 'Rate') {
            regRateChartsData.value = el.y.map((val) =>
              parseFloat((val * 100).toFixed(2))
            );
            // vokRateChartsData.value = el.y;
          }
        });
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const clusterChange = () => {
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
