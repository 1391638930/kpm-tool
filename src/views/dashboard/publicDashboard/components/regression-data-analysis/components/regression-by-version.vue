<!-- eslint-disable prettier/prettier -->
<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t("regressionDataAnalysis.versionDimension") }}
      </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-form-item field="name" label="Variant">
            <a-select
              v-model="variantValue"
              :style="{ width: '220px' }"
              placeholder="Cluster Type"
              @change="variantChange"
            >
              <a-option
                v-for="item of variantArray"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </a-select>
          </a-form-item>
        </a-space>
      </template>
      <Chart style="width: 100%; height: 447px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    queryTicketByVersion,
    ContentTicketRecord,
  } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';

  import { getCurrentDateTime } from '@/utils/utils';

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
        ${el.seriesName === 'verRate' ? `${el.value}%` : el.value}
          </span>
        </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const clusterValue = ref('CL39');
  const variantValue = ref('High');
  const variantArray = [
    {
      label: 'High',
      value: 'High',
    },
    {
      label: 'Premium',
      value: 'Premium',
    },
  ];
  const xAxis = ref<string[]>([]);
  const regChartsData = ref<number[]>([]);
  const normalChartsData = ref<number[]>([]);
  const regRateChartsData = ref<number[]>([]);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Version Regression Ticket`,
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
        data: ['regression', 'normal', 'verRate'],
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: 'png',
            name: `${
              clusterValue.value
            }_Version_Regression_Ticket_${getCurrentDateTime()}`,
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
          name: 'verRate',
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
          type: 'bar',
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          color: '#F2D88C',
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
              borderColor: '#E2F2FF',
            },
          },
        },

        {
          name: 'verRate',
          data: regRateChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          color: '#A6A6A6',
          smooth: true,

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
        },
      ],
      dataZoom: [
        {
          bottom: 0,
          type: 'slider',
          left: 65,
          right: 65,
          height: 14,
          start: 20,
          borderColor: 'transparent',
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
      const { data: chartData } = await queryTicketByVersion(
        clusterValue.value,
        variantValue.value
      );

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
  const variantChange = () => {
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
