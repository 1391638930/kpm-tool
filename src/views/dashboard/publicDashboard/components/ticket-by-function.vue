<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '14px', height: '75px' }"
    >
      <template #title>
        {{ $t('publicDashboard.ticketByFunc') }}
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
      <Chart style="width: 100%; height: 347px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useLoading from '@/hooks/loading';
  import { queryTicketStatsByFunc, ContentTicketRecord } from '@/api/dashboard';

  import useChartOption from '@/hooks/chart-option';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
    <p>
      <span style="background-color: ${
        el.color
      }" class="tooltip-item-icon"></span>
      <span>
      Ticket Number&nbsp   
      </span>
    </p>
    <span class="tooltip-value">
      ${Number(el.value).toLocaleString()}
    </span>
  </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const xAxis = ref<string[]>([]);
  const textChartsData = ref<number[]>([]);
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

  const { chartOption } = useChartOption((isDark) => {
    return {
      grid: {
        left: '5%',
        right: 0,
        top: '50',
        bottom: '40%',
      },
      legend: {
        bottom: 0,
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
          lineStyle: {
            color: '#86909C',
          },
        },
        axisLabel: {
          color: '#86909C',
          interval: 0,
          rotate: 40,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#86909C',
          formatter(value: number, idx: number) {
            if (idx === 0) return `${value}`;
            return `${value}`;
          },
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#3F3F3F' : '#E5E6EB',
          },
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      series: [
        {
          // name: '纯文本',
          data: textChartsData.value,
          stack: 'one',
          type: 'bar',
          barWidth: 16,
          label: {
            show: true,
            position: 'top',
            fontSize: 10,
          },
          //   color: isDark ? '#4A7FF7' : '#246EFF',
        },
        // {
        //   name: '图文类',
        //   data: imgChartsData.value,
        //   stack: 'one',
        //   type: 'bar',
        //   //   color: isDark ? '#085FEF' : '#00B2FF',
        // },
        // {
        //   name: '视频类',
        //   data: videoChartsData.value,
        //   stack: 'one',
        //   type: 'bar',
        //   //   color: isDark ? '#01349F' : '#81E2FF',
        //   itemStyle: {
        //     borderRadius: 2,
        //   },
        // },
      ],
    };
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryTicketStatsByFunc(
        clusterValue.value
      );
      // console.log('ticket-by-function', chartData, chartData[0]);
      xAxis.value = chartData[0].x;
      chartData.forEach((el: ContentTicketRecord) => {
        textChartsData.value = el.y;
      });
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

<style scoped lang="less"></style>
