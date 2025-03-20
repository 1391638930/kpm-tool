<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('pmDataAnalysis.pmOverallStats') }}
      </template>
      <!-- <template #extra>
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
                  :style="{ width: '220px' }"
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
      </template> -->
      <Chart
        ref="myChart"
        style="width: 100%; height: 497px"
        :option="chartOption"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { ContentPmRecord, queryPmOverAll } from '@/api/visualization';
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
  const clusterValue = ref('CL43');

  const xAxis = ref<string[]>([]);
  const noSupplierChartsData = ref<number[]>([]);
  const supplierTakenChartsData = ref<number[]>([]);
  const supplierVerifyData = ref<number[]>([]);
  const solvedChartsData = ref<number[]>([]);
  const checkBackChartsData = ref<number[]>([]);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} KPM Ticket Statistic(Overall)`,
        left: 'center',
        top: '2',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${clusterValue.value}_Stats_Overall_${getCurrentDateTime()}`,
            type: 'png',
            excludeComponents: ['dataZoom', 'toolbox'],
          },
        },
      },
      grid: {
        left: '40',
        right: '40',
        top: '50',
        bottom: '50',
        containLabel: true,
      },
      legend: [
        {
          // icon: 'circle',
          data: [
            'No Supplier',
            'Supplier Taken',
            'Supplier Verification',
            'Solved',
            'CheckBack',
          ],
          icon: 'circle',
          bottom: 20,
          itemWidth: 10, // 设置图例图标的宽度为10px
          itemHeight: 10, // 设置图例图标的高度为10px
          itemGap: 5,
          textStyle: {
            color: '#4E5969',
          },
        },
      ],
      xAxis: [
        {
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
            // alignWithLabel: true,
            lineStyle: {
              color: '#000', // 设置颜色为黑色
              width: 1, // 设置线宽为2，这会使得刻度线看起来更粗
            },
            // lineStyle: {
            //   color: '#86909C',
            // },
            interval(idx: number) {
              if (idx === 0) return false;
              // if (idx === xAxis.value.length - 1) return false;
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
            rotate: 60,
            formatter(value) {
              return value.split(' ').join('\n');
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'solid',
              // color: isDark ? '#3F3F3F' : '#E5E6EB',
            },
            show: true,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
          },
        },
      ],
      series: [
        {
          zlevel: 2,
          name: 'No Supplier',
          data: noSupplierChartsData.value,
          stack: 'overall',
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          barGap: 0.1,
          // color: isDark ? '#3D72F6' : '#246EFF',
          color: '#FEFF54',
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
          name: 'Supplier Taken',
          zlevel: 2,
          data: supplierTakenChartsData.value,
          barGap: 0.1,
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          stack: 'overall',
          color: '#F5C242',
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
          name: 'Supplier Verification',
          zlevel: 2,
          data: supplierVerifyData.value,
          barGap: 0.1,
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          stack: 'overall',
          color: '#9FCE63',
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
          name: 'Solved',
          zlevel: 2,
          data: solvedChartsData.value,
          barGap: 0.1,
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          stack: 'overall',
          color: '#4EAC58',
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
          name: 'CheckBack',
          zlevel: 2,
          data: checkBackChartsData.value,
          barGap: 0.1,
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          stack: 'overall',
          color: '#BCBCBB',
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

  const fetchData1 = () => {
    xAxis.value = [
      'CW01',
      'CW02',
      'CW03',
      'CW04',
      'CW05',
      'CW06',
      'CW07',
      'CW08',
      'CW09',
      'CW10',
      'CW11',
      'CW12',
      'CW13',
      'CW14',
      'CW15',
      'CW16',
      'CW17',
      'CW18',
      'CW19',
      'CW20',
    ];
    noSupplierChartsData.value = [
      88, 105, 102, 82, 83, 93, 118, 113, 129, 153, 133, 161, 161, 141, 117,
      120, 73, 120, 42, 24,
    ];
    supplierTakenChartsData.value = [
      193, 184, 193, 194, 200, 188, 192, 251, 312, 287, 257, 248, 290, 296, 261,
      264, 250, 231, 139, 152,
    ];
    supplierVerifyData.value = [
      72, 60, 61, 89, 106, 123, 142, 102, 109, 154, 157, 140, 138, 199, 138,
      217, 169, 145, 107, 108,
    ];
    solvedChartsData.value = [
      133, 153, 150, 115, 111, 146, 121, 150, 157, 203, 200, 159, 125, 159, 174,
      135, 128, 95, 99, 124,
    ];
    checkBackChartsData.value = [
      41, 42, 47, 44, 42, 46, 43, 58, 54, 60, 52, 70, 65, 70, 61, 72, 59, 41,
      23, 43,
    ];

    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryPmOverAll(
        `pm${clusterValue.value}`
      );
      if (chartData.length === 0) {
        xAxis.value = [];
        noSupplierChartsData.value = [];
        supplierTakenChartsData.value = [];
        supplierVerifyData.value = [];
        solvedChartsData.value = [];
        checkBackChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentPmRecord) => {
          if (el.name === 'No Supplier') {
            noSupplierChartsData.value = el.y;
          } else if (el.name === 'Supplier Taken') {
            supplierTakenChartsData.value = el.y;
          } else if (el.name === 'Supplier Verification') {
            supplierVerifyData.value = el.y;
          } else if (el.name === 'Solved') {
            solvedChartsData.value = el.y;
          } else if (el.name === 'CheckBack') {
            checkBackChartsData.value = el.y;
          }
        });
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  fetchData();
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
