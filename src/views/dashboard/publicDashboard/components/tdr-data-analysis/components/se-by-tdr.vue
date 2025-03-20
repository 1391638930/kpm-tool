<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('tdrDataAnalysis.seTdrStats') }}
      </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-row justify="end">
            <a-col :span="8">
              <a-form-item field="name" label="Cluster">
                <a-select
                  v-model="clusterValue"
                  :style="{ width: '320px' }"
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
            </a-col>
            <a-col :span="8">
              <a-form-item field="name" label="Market">
                <a-select
                  v-model="marketValue"
                  :style="{ width: '320px' }"
                  placeholder="Cluster Type"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of marketArray"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
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
  import { ContentSeTdrRecord, querySeByTdr } from '@/api/visualization';
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

  const marketValue = ref('CN');
  const marketArray = [
    {
      label: 'CN',
      value: 'CN',
    },
    {
      label: 'JP',
      value: 'JP',
    },
    {
      label: 'KR',
      value: 'KR',
    },
    {
      label: 'TW',
      value: 'TW',
    },
  ];

  const xAxis = ref<string[]>([]);
  const ratingAChartsData = ref<number[]>([]);
  const existingRatingAChartsData = ref<number[]>([]);
  const ratingBChartsData = ref<number[]>([]);
  const existingRatingBChartsData = ref<number[]>([]);
  const mileTotalChartsData = ref<number[]>([]);
  const testHourTotalChartsData = ref<number[]>([]);
  const yInterval = ref<number>(10);

  function calculateInterval(min: number, max: number): number {
    const range = max - min;
    let interval: number;

    if (range <= 100) {
      interval = 20;
    } else if (range <= 800) {
      interval = 100;
    } else {
      interval = 1000;
    }

    return interval;
  }

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Test Data Record Statistics`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_Test_Data_Record_Statistics${getCurrentDateTime()}`,
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
          interval: yInterval.value,
          min: -yInterval.value,
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
            formatter: '{value}',
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
          name: 'Rating A',
          data: ratingAChartsData.value,
          stack: 'rating_a',
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
            fontSize: 10,
          },
        },
        {
          name: 'Existing Rating A',
          zlevel: 2,
          stack: 'rating_a',
          data: existingRatingAChartsData.value,
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
            fontSize: 10,
          },
        },
        {
          name: 'Rating B',
          zlevel: 2,
          stack: 'rating_b',
          data: ratingBChartsData.value,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          color: '#FFDF7D',
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
            fontSize: 10,
          },
        },
        {
          name: 'Existing Rating B',
          zlevel: 2,
          stack: 'rating_b',
          data: existingRatingBChartsData.value,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          color: '#FFEAA8',
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
            fontSize: 10,
          },
        },
        {
          name: 'Test Hour',
          data: testHourTotalChartsData.value,
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
            formatter: '{c}',
          },
        },
        {
          name: 'Mile',
          data: mileTotalChartsData.value,
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
            formatter: '{c}',
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
      // console.log('marketValue', marketValue.value);
      const { data: chartData } = await querySeByTdr(
        clusterValue.value,
        marketValue.value
      );
      if (chartData.length === 0) {
        xAxis.value = [];
        ratingAChartsData.value = [];
        existingRatingAChartsData.value = [];
        ratingBChartsData.value = [];
        existingRatingBChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        let statsRange = [] as any;
        chartData.forEach((el: ContentSeTdrRecord) => {
          if (el.name === 'Rating A') {
            ratingAChartsData.value = el.y;
          } else if (el.name === 'Existing Rating A') {
            existingRatingAChartsData.value = el.y;
          } else if (el.name === 'Rating B') {
            ratingBChartsData.value = el.y;
          } else if (el.name === 'Existing Rating B') {
            existingRatingBChartsData.value = el.y;
          } else if (el.name === 'Mile Total') {
            // mileTotalChartsData.value = el.y;
            mileTotalChartsData.value = el.y.map((val) =>
              parseFloat(val.toFixed(2))
            );
            statsRange = statsRange.concat(el.y);
          } else if (el.name === 'Test Hour Total') {
            testHourTotalChartsData.value = el.y.map((val) =>
              parseFloat(val.toFixed(2))
            );

            statsRange = statsRange.concat(el.y);

            // testHourTotalChartsData.value = el.y;
          }
        });
        const dataMin = Math.min(...statsRange);
        const dataMax = Math.max(...statsRange);
        yInterval.value = calculateInterval(dataMin, dataMax);
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
