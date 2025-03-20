<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('verificationDataAnalysis.supplierDimension') }}
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
          <a-form-item field="week" label="YearWeek">
            <a-select
              v-model="weekValue"
              :style="{ width: '220px' }"
              placeholder="Cluster Type"
              @change="weekChange"
            >
              <a-option
                v-for="item of weekArray"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </a-select>
          </a-form-item>
          <a-form-item field="name" label="FFD">
            <a-select
              v-model="ffdValue"
              :style="{ width: '220px' }"
              @change="ffdChange"
            >
              <a-option
                v-for="item of ffdArray"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </a-select>
          </a-form-item>
        </a-space>
      </template>
      <Chart
        style="width: 100%; height: 447px"
        :option="chartOption"
        @click-chart="handleClickChart"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    queryVerifyBySupplier,
    ContentVerifyRecord,
  } from '@/api/visualization';
  import { queryVerifyWeekList } from '@/api/list';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';

  import { useRouter } from 'vue-router';
  import { getCurrentDateTime } from '@/utils/utils';
  import { useTabBarStore } from '@/store';

  const router = useRouter();

  // const chartTheme = ref('customed');
  // echarts.init(chartRef, 'customed');

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
        ${el.seriesName === 'VOKRate' ? `${el.value}%` : el.value}
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

  const ffdValue = ref('all');
  const ffdArray = [
    {
      label: 'ALL',
      value: 'all',
    },
    {
      label: 'MIB',
      value: 'nodb',
    },
    {
      label: 'DB',
      value: 'db',
    },
    {
      label: 'AED',
      value: 'Asterix',
    },
  ];
  const weekValue = ref('all');
  const xAxis = ref<string[]>([]);
  const vokChartsData = ref<number[]>([]);
  const vnokChartsData = ref<number[]>([]);
  const vokRateChartsData = ref<number[]>([]);
  const weekArray = ref([] as any);

  const fetchWeekList = async () => {
    const { data } = await queryVerifyWeekList(clusterValue.value);
    weekArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      weekArray.value.push({ label: val.year_week, value: val.year_week });
    });
  };

  onMounted(() => {
    fetchWeekList();
  });

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Verification Status By Supplier`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: 'png',
            name: `${
              clusterValue.value
            }_Verification_Status_By_Supplier_${getCurrentDateTime()}`,
          },
        },
      },

      grid: {
        left: '40',
        right: '40',
        top: '50',
        bottom: '35',
        containLabel: true,
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
          // color: '#86909C',
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
          name: 'VOKRate',
          min: 0,
          max: 100,
          interval: 10,
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
          },
        },
      ],

      tooltip: {
        trigger: 'axis', // 触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据，
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效，
          type: 'line', // 默认为line，line直线，cross十字准星，shadow阴影
          crossStyle: {
            color: '#fff',
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
          name: 'VOK',
          data: vokChartsData.value,
          stack: 'verify',
          type: 'bar',
          barMaxWidth: 50,
          zlevel: 2,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#3D72F6' : '#246EFF',
          symbol: 'circle',
          color: '#4A7D31',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
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
          name: 'VNOK',
          stack: 'verify',
          data: vnokChartsData.value,
          type: 'bar',
          barMaxWidth: 50,
          zlevel: 2,
          smooth: true,
          showSymbol: false,
          color: '#962E35',
          // color: isDark ? '#A079DC' : '#00B2FF',
          // symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
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
          name: 'VOKRate',
          data: vokRateChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          zlevel: 3,
          smooth: true,
          // showSymbol: false,
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          // symbol: 'circle',
          color: '#A6A6A6',
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          // symbol: 'circle',
          symbolSize: 5,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#D9F6FF',
            },
          },
          lineStyle: {
            opacity: 0,
          },
          markLine: {
            zlevel: 1,
            // name: '警戒线',
            // symbol: 'none',
            silent: false,
            label: {
              position: 'start',
              formatter: '',
            },
            data: [
              {
                type: 'average',
                silent: false,
                lineStyle: {
                  type: 'solid',
                  color: 'red',
                },
                yAxis: 80,
              },
            ],
          },
          label: {
            show: true,
            position: 'left',
            formatter: '{c}%',
          },
        },
      ],
    };
  });

  const tabBarStore = useTabBarStore();
  const handleClickChart = (params: any) => {
    // console.log('supplier  handleClickChart', params);
    let dataKind = 'All';
    if (params.componentIndex === 2) {
      dataKind = 'To be done';
    } else if (params.componentIndex === 1) {
      dataKind = 'VNOK';
    } else {
      dataKind = 'VOK';
    }
    const queryParams = {
      clusterType: clusterValue.value,
      week: weekValue.value,
      ee_results: dataKind,
      supplier: params.name,
    };
    tabBarStore.deleteTagByName('VerificationList');
    router.push({ name: 'VerificationList', query: queryParams });
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryVerifyBySupplier(
        clusterValue.value,
        weekValue.value,
        ffdValue.value
      );
      // console.log('supplier', chartData);
      if (chartData.length === 0) {
        xAxis.value = [];
        vokChartsData.value = [];
        vnokChartsData.value = [];
        vokRateChartsData.value = [];
        // this.chart.clear()
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentVerifyRecord) => {
          if (el.name === 'VOK') {
            vokChartsData.value = el.y;
          } else if (el.name === 'VNOK') {
            vnokChartsData.value = el.y;
          } else if (el.name === 'VOK Rate') {
            vokRateChartsData.value = el.y.map((val) =>
              parseFloat((val * 100).toFixed(2))
            );
          }
        });
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const weekChange = () => {
    fetchData();
  };

  const clusterChange = () => {
    fetchWeekList().then(() => {
      weekValue.value = 'all';
      fetchData();
    });
  };
  const ffdChange = () => {
    fetchWeekList().then(() => {
      fetchData();
    });
  };

  fetchData();
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
