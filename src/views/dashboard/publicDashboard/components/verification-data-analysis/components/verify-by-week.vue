<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('verificationDataAnalysis.weekDimension') }}
      </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-row justify="end">
            <a-col :span="5">
              <a-form-item field="name" label="Cluster">
                <a-select
                  v-model="clusterValue"
                  :style="{ width: '200px' }"
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
            <a-col :span="5">
              <a-form-item field="name" label="Supplier">
                <a-select
                  v-model="supplierValue"
                  :style="{ width: '200px' }"
                  @change="selectChange"
                >
                  <template #label="{ data }">
                    <span
                      style="
                        width: 90px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      >{{ data?.label }}</span
                    >
                  </template>
                  <a-option
                    v-for="item of supplierArray"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item field="name" label="FFD">
                <a-select
                  v-model="ffdValue"
                  :style="{ width: '200px' }"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of ffdArray"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item field="name" label="Func">
                <a-select
                  v-model="functionValue"
                  :style="{ width: '200px' }"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of functionArray"
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
        style="width: 100%; height: 447px"
        :option="chartOption"
        @click-chart="handleClickChart"
      />
      <!-- <button @click="downloadChart">下载图表</button> -->
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useTabBarStore } from '@/store';

  import {
    queryVerifyByWeek,
    ContentVerifyRecord,
    querySupplierList,
    queryFunctionList,
  } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';

  import { useRouter } from 'vue-router';
  import { getCurrentDateTime } from '@/utils/utils';

  const router = useRouter();
  const myChart = ref(null);

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
  const supplierValue = ref('all');
  const functionValue = ref('all');
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
  const xAxis = ref<string[]>([]);
  const vokChartsData = ref<number[]>([]);
  const vnokChartsData = ref<number[]>([]);
  const toBeDoneChartsData = ref<number[]>([]);
  const vokRateChartsData = ref<number[]>([]);
  const supplierArray = ref([] as any);
  const functionArray = ref([] as any);

  const fetchSupplierList = async () => {
    const { data } = await querySupplierList();

    supplierArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      if (val.name === '') {
        supplierArray.value.push({
          label: 'no Supplier',
          value: 'no Supplier',
        });
      } else {
        supplierArray.value.push({ label: val.name, value: val.name });
      }
    });
  };

  const fetchFunctionList = async () => {
    const { data } = await queryFunctionList();
    functionArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      functionArray.value.push({ label: val.name, value: val.name });
    });
  };

  onMounted(() => {
    fetchSupplierList();
    fetchFunctionList();
  });

  const tabBarStore = useTabBarStore();
  const handleClickChart = (params: any) => {
    console.log('handleClickChart', params);
    let dataKind = 'All';
    if (params.componentIndex === 2) {
      dataKind = 'Test Block';
    } else if (params.componentIndex === 1) {
      dataKind = 'VNOK';
    } else {
      dataKind = 'VOK';
    }
    const queryParams = {
      clusterType: clusterValue.value,
      week: params.name,
      ee_results: dataKind,
      supplier: supplierValue.value,
      function: functionValue.value,
      ffd: ffdValue.value,
    };
    tabBarStore.deleteTagByName('VerificationList');
    router.push({ name: 'VerificationList', query: queryParams });
  };

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Verification Status`,
        left: 'center',
        fontWeight: 'bolder',
      },

      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_Verification_Status_${getCurrentDateTime()}`,
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
            formatter: '{value}%',
            color: '#000000',
          },
        },
      ],
      // 提示框取默认值，即鼠标移动到柱状图会显示内容
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
          zlevel: 2,
          name: 'VOK',
          data: vokChartsData.value,
          stack: 'verify',
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#3D72F6' : '#246EFF',
          color: '#4A7D31',
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
          name: 'VNOK',
          zlevel: 2,
          stack: 'verify',
          data: vnokChartsData.value,
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
          color: '#962E35',
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
          name: 'Test Block',
          zlevel: 2,
          stack: 'verify',
          data: toBeDoneChartsData.value,
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
          color: '#F2D88C',
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
          name: 'VOKRate',
          data: vokRateChartsData.value,
          type: 'line',
          yAxisIndex: 1,
          color: '#A6A6A6',
          zlevel: 3,
          smooth: true,
          // showSymbol: true,
          // color: isDark ? '#6CAAF5' : '#81E2FF',
          // symbol: 'circle',
          markLine: {
            // name: '警戒线',
            // symbol: 'none',
            zlevel: 1,
            silent: false,
            label: {
              position: 'start',
              formatter: '',
              padding: [10, 0, 0, 10],
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
            formatter: '{c}%',
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
      const { data: chartData } = await queryVerifyByWeek(clusterValue.value, {
        supplier: supplierValue.value,
        function: functionValue.value,
        ffd: ffdValue.value,
      });
      if (chartData.length === 0) {
        xAxis.value = [];
        vokChartsData.value = [];
        vnokChartsData.value = [];
        vokRateChartsData.value = [];
        toBeDoneChartsData.value = [];
      } else {
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentVerifyRecord) => {
          if (el.name === 'VOK') {
            vokChartsData.value = el.y;
          } else if (el.name === 'VNOK') {
            vnokChartsData.value = el.y;
          } else if (el.name === 'Test Block') {
            toBeDoneChartsData.value = el.y;
          } else if (el.name === 'VOK Rate') {
            vokRateChartsData.value = el.y.map((val) =>
              parseFloat((val * 100).toFixed(2))
            );
            // vokRateChartsData.value = el.y;
          }
        });
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
