<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('workplace.ticketByWeek') }}
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
      <Chart style="width: 100%; height: 447px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryTicketStatsByWeek, ContentTicketRecord } from '@/api/dashboard';
  // import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';
  // import { getCurrentDateTime } from '@/utils/utils';

  // const chartTheme = ref('customed');
  // echarts.init(chartRef, 'customed');
  import { useRouter } from 'vue-router';

  const router = useRouter();
  // const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
  //   return items
  //     .map(
  //       (el) => `<div class="content-panel">
  //       <p>
  //         <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>

  //         <span>${el.seriesName}</span>
  //       </p>
  //       <span class="tooltip-value">
  //       ${el.value}
  //       </span>
  //     </div>`
  //     )
  //     .join('');
  // };

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
  const normalChartsData = ref<number[]>([]);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Weekly Ticket Count`,
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
      ],
      series: [
        {
          name: 'normal',
          zlevel: 2,
          data: normalChartsData.value,
          stack: 'verify',
          type: 'bar',
          smooth: true,
          showSymbol: false,
          color: '#4358B9',
          label: {
            show: true,
            position: 'top',
            fontSize: 10,
          },
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E0E3FF',
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
          borderColor: 'transparent',
          start: 25,
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
      const { data: chartData } = await queryTicketStatsByWeek(
        clusterValue.value
      );
      if (chartData.length === 0) {
        xAxis.value = [];
        normalChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentTicketRecord) => {
          normalChartsData.value = el.y;
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
