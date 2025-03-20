<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('pmDataAnalysis.flowWeekStats') }}
      </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-row justify="end">
            <a-col :span="8">
              <a-form-item field="name" label="Cluster">
                <a-select
                  v-model="clusterValue"
                  placeholder="Cluster Type"
                  :style="{ width: '220px' }"
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
              <a-form-item field="name" label="Supplier">
                <a-select
                  v-model="supplierValue"
                  :style="{ width: '220px' }"
                  placeholder="Cluster Type"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of supplierArray"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-form-item field="name" label="Dimension">
                <a-select
                  v-model="rangeValue"
                  :style="{ width: '220px' }"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of rangeArray"
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
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';

  import { ContentTicketRecord, queryTicketByFlow } from '@/api/visualization';
  import { getCurrentDateTime } from '@/utils/utils';

  const { loading, setLoading } = useLoading(true);
  const clusterValue = ref('CL46');
  const supplierValue = ref('all');
  const rangeValue = ref('weekly');

  const xAxis = ref<string[]>([]);
  const outFlowChartsData = ref<number[]>([]);
  const inFlowChartsData = ref<number[]>([]);

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

  const supplierArray = [
    {
      label: 'ALL',
      value: 'all',
    },
    {
      label: 'FF HARMAN-NAV',
      value: 'FF HARMAN-NAV',
    },
  ];

  const rangeArray = [
    {
      label: 'Weekly',
      value: 'weekly',
    },
    {
      label: 'Daily',
      value: 'daily',
    },
  ];

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} KPM Ticket Flow(Inflow/Outflow)`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${clusterValue.value}_Flow_By_${
              rangeValue.value
            }_${getCurrentDateTime()}`,
            type: 'png',
            excludeComponents: ['dataZoom', 'toolbox'],
          },
        },
      },
      grid: {
        left: '60',
        right: '40',
        top: '40',
        bottom: '50',

        containLabel: true,
      },
      legend: [
        {
          // icon: 'circle',
          data: ['Outflow', 'Inflow'],
          bottom: 30,
          left: 0,

          orient: 'vertical',
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
            // rotate: 60,
            formatter(value) {
              return value.split(' ').join('\n');
            },
          },
        },
        {
          data: outFlowChartsData.value,
          position: 'bottom', // 将坐标轴定位到底部
          offset: 40, // 设置位置偏移
          axisTick: {
            show: true,
            length: 40,
          },
        },
        {
          data: inFlowChartsData.value,
          position: 'bottom',
          offset: 60,
          axisTick: {
            show: false,
          },
        },
        {
          // 最后加一个无data的项，作为表格最底部的线
          position: 'bottom',
          offset: 80,
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          // interval: 30,
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryTicketByFlow(
        clusterValue.value,
        supplierValue.value,
        rangeValue.value
      );
      const chartData: any = data.list;
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

  const selectChange = () => {
    fetchData();
  };
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
