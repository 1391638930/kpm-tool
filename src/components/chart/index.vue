<template>
  <VCharts
    v-if="renderChart"
    :option="options"
    ref="vCharts"
    :autoresize="autoResize"
    :style="{ width, height }"
    @click="handleClientEvent"
  />
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick, watch } from 'vue';
  import { use } from 'echarts/core';
  import VCharts from 'vue-echarts';
  import _ from 'lodash';
  // import 'echarts/lib/component/title';
  // import 'echarts/lib/component/markLine';
  import {
    ToolboxComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    MarkLineComponent,
  } from 'echarts/components';

  use([
    ToolboxComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    MarkLineComponent,
  ]);

  const props = defineProps({
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    isDynamicRotate: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['clickChart']);

  const handleClientEvent = (params: any) => {
    // console.log(params, 'handleClickEvent');
    emit('clickChart', params);
  };

  // const appStore = useAppStore();
  // const theme = computed(() => {
  //   if (appStore.theme === 'dark') return 'dark';
  //   return '';
  // });
  const renderChart = ref(false);
  // wait container expand
  nextTick(() => {
    renderChart.value = true;
  });

  // 全局动态改变x轴rotate角度
  const vCharts = ref()
  let echartsInstance: any = null;
  let xAxisData: any = null;
  let xAxis: any = null;
  const changeRotate = () => {
    setTimeout(() => {
      echartsInstance = vCharts.value.chart;
      xAxisData = echartsInstance.getOption().xAxis[0].data;
      const { xAxis: [axis] } = echartsInstance.getOption();
      xAxis = axis;

      const debouncedHandler = _.debounce(() => {
        if (echartsInstance.getOption().dataZoom[0].start !== undefined) {
          const { start } = echartsInstance.getOption().dataZoom[0]
          const { end } = echartsInstance.getOption().dataZoom[0]

          const strLength = xAxis.data[0].length
          const startIndex = Math.floor(start / (100 / xAxisData.length));
          const endIndex = Math.floor(end / (100 / xAxisData.length));
          const showLength = endIndex - startIndex;
          let r;
          if (showLength < 20 && strLength < 10) {
            r = 0;
          } else if ((showLength < 20 && strLength < 10) || (showLength >= 20 && showLength < 50)) {
            r = 45;
          } else if (showLength >= 50 && showLength < 70) {
            r = 65
          } else {
            r = 90;
          }
          const newXAxisOptions = {
            ...xAxis,
            axisLabel: {
              ...xAxis.axisLabel,
              rotate: r,
            },
          };
          const newOptions = {
          ...echartsInstance.getOption(),
            xAxis: [newXAxisOptions],
          };
          echartsInstance.setOption(newOptions);
        }
      }, 500);
      debouncedHandler()
      echartsInstance.on('datazoom', debouncedHandler);
    }, 0)
  }

  watch(
    () => props.isDynamicRotate,
    (newValue) => {
      if (newValue) {
        changeRotate()
      }
    }
  );
</script>

<style scoped lang="less"></style>
