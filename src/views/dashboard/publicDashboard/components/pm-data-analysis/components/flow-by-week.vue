<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('pmDataAnalysis.flowWeekStats') }}
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
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';

  import { ContentTicketRecord, queryPmByFlow } from '@/api/visualization';
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
  const outFlowChartsData = ref<number[]>([]);
  const inFlowChartsData = ref<number[]>([]);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} KPM Ticket Statistic(Inflow/Outflow)`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${clusterValue.value}_Flow_By_Week_${getCurrentDateTime()}`,
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
      legend: [
        {
          // icon: 'circle',
          data: ['Outflow', 'Inflow'],
          bottom: 40,
          left: 0,

          orient: 'vertical',
          itemWidth: 10, // 设置图例图标的宽度为10px
          itemHeight: 10, // 设置图例图标的高度为10px
          itemGap: 5,
          textStyle: {
            color: '#4E5969',
          },
        },

        // {
        //   // icon: 'circle',
        //   data: ['Outflow', 'Inflow'],

        //   top: '20', // 控制图例与顶部的距离
        //   left: '20', // 控制图例与右侧的距离
        //   icon: 'circle',
        //   // bottom: 60,
        //   itemWidth: 10, // 设置图例图标的宽度为10px
        //   itemHeight: 10, // 设置图例图标的高度为10px
        //   itemGap: 5,
        //   textStyle: {
        //     color: '#4E5969',
        //   },
        // },
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
            show: false,
            // alignWithLabel: true,
            length: 100,
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
        {
          data: outFlowChartsData.value,
          position: 'bottom', // 将坐标轴定位到底部
          offset: 50, // 设置位置偏移
          axisTick: {
            show: true,
            length: 40,
          },
        },
        {
          data: inFlowChartsData.value,
          position: 'bottom',
          offset: 70,
          axisTick: {
            show: false,
          },
        },
        {
          // 最后加一个无data的项，作为表格最底部的线
          position: 'bottom',
          offset: 90,
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: -500,
          interval: 100,
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
          name: 'Inflow',
          zlevel: 2,
          stack: 'total',
          data: inFlowChartsData.value,
          barGap: 0.1,
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          color: '#FFC000',
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
          zlevel: 2,
          name: 'Outflow',
          data: outFlowChartsData.value,
          stack: 'total',
          type: 'bar',
          barMaxWidth: 30,
          smooth: true,
          showSymbol: false,
          barGap: 0.1,
          // color: isDark ? '#3D72F6' : '#246EFF',
          color: '#00B050',
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

    outFlowChartsData.value = [
      -53, -54, -51, -111, -142, -75, -153, -104, -115, -100, -262, -155, -112,
      -107, -265, -381, -227, -237, -195,
    ];
    inFlowChartsData.value = [
      58, 77, 54, 88, 160, 144, 173, 184, 225, 229, 156, 153, 91, 172, 238, 280,
      71, 190, 181,
    ];

    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryPmByFlow(
        `pm${clusterValue.value}`
      );
      if (chartData.length === 0) {
        xAxis.value = [];
        outFlowChartsData.value = [];
        inFlowChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentTicketRecord) => {
          if (el.name === 'outFlow') {
            outFlowChartsData.value = el.y;
          } else if (el.name === 'inFlow') {
            inFlowChartsData.value = el.y;
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
