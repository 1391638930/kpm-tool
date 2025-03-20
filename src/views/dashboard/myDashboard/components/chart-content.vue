<template>
  <div class="chartContainer" ref="chartContainer"> </div>
</template>

<script lang="ts" setup>
  // import { queryMyDashboardList, deleteDashboard } from '@/api/dashboard';
  import { onMounted, ref, watch } from 'vue';
  import * as Echarts from 'echarts';
  import type { ECharts, SeriesOption } from 'echarts';

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  watch(
    () => props.data,
    async (newValue: any, oldValue: any) => {
      console.log('newValue', newValue);
    }
  );
  const chartContainer = ref(null);
  const chartOption = ref({});
  let chartCase: ECharts | null = null;
  const initChart = () => {
    if (chartCase) {
      chartCase.dispose();
      chartCase = null;
    }
    const info = props.data.info;
    const data = props.data.data;

    let xAxisData: string[] = [];
    const series: SeriesOption[] = [];
    if (info.chart_type === 'bar' || info.chart_type === 'line') {
      xAxisData = data[0].x;
      data.forEach((item: any) => {
        series.push({
          data: item.y,
          type: info.chart_type,
          smooth: true,
        });
      });
      chartOption.value = {
        title: {
          text: info.chart_name,
          left: 'center',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
        },
        series,
      };
    } else if (info.chart_type === 'pie') {
      data.forEach((item: any) => {
        const seriesData: any[] = [];
        data[0].x.forEach((legend: any, index: number) => {
          seriesData.push({
            name: legend,
            value: data[0].y[index],
          });
        });
        series.push({
          type: info.chart_type,
          data: seriesData,
          radius: '50%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        });
      });
      chartOption.value = {
        title: {
          text: info.chart_name,
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 20,
        },
        series,
      };
    }
    if (chartContainer.value) {
      chartCase = Echarts.init(chartContainer.value);
      chartCase.setOption(chartOption.value);
    }
  };

  onMounted(() => {
    initChart();
  });
</script>

<style scoped lang="less">
  .chartContainer {
    width: 100%;
    height: 100%;
  }
</style>
