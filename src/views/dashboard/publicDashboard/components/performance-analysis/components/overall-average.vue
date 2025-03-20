<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '5px', paddingTop: '32px', justifyContent: 'center' }"
    >
      <template #extra>
        <a-space direction="horizontal" size="medium">
        </a-space>
      </template>
      <Chart
        ref="myChart"
        style="width: 100%; height: 447px"
        :option="chartOption"
        :key="chartKey"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';

  import {
    queryOverallAverage,
    ContentVerifyRecord,
  } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';

  import { getCurrentDateTime } from '@/utils/utils';

  const myChart = ref(null);

  const props = defineProps({
    project: {
      type: String
    }
  });

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map((el) => `<div class="content-panel" style="width: 100%;">
        <p style="margin-right: 20px;">
          <span style="background-color: ${
            el.color
          }" class="tooltip-item-icon"></span>

          <span>${el.seriesName?.split(' ')[0]}</span>
        </p>
        <span class="tooltip-value">

        ${el.seriesName === 'VOKRate' ? `${el.value}%` : el.value}
        </span>
      </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const clusterValue = ref('Performance_Analysis');

  const xAxis = ref<string[]>([]);
  const actualChartsData = ref<number[]>([]);
  const expectedChartsData = ref<number[]>([]);

  const { chartOption }: any = useChartOption((isDark) => {
    return {
      title: {
        text: 'Overall Average Init Time for Different Feature',
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_Overall_Average_Init_Time_for_Different Feature_${getCurrentDateTime()}`,
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
        }
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
      series: [
        {
          name: 'Actual Result',
          zlevel: 2,
          data: actualChartsData.value,
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
        },
        {
          name: 'Expected Result',
          zlevel: 2,
          data: expectedChartsData.value,
          type: 'line',
          barMaxWidth: 50,
          smooth: true,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
        },
      ],
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
      const { data: chartData } = await queryOverallAverage(props.project!);
      if (chartData.length === 0) {
        xAxis.value = [];
        actualChartsData.value = [];
        expectedChartsData.value = [];
        chartOption.value.graphic.style.text = 'No Data';
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentVerifyRecord) => {
          if (el.name === 'Actual Result') {
            actualChartsData.value = el.y;
          } else if (el.name === 'Expected Result') {
            expectedChartsData.value = el.y;
          }
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

  watch(
    () => props.project,
    (newValue) => {
      if (newValue !== undefined) {
        fetchData()
      }
    }, {
      immediate: true
    }
  )
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
