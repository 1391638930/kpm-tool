<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title>
        {{ $t('regressionDataAnalysis.cancelDimension') }}
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
  import { queryTicketStatsByCancel } from '@/api/visualization';
  import useChartOption from '@/hooks/chart-option';

  // const router = useRouter();
  const { loading, setLoading } = useLoading(false);
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

  const totalRes = ref({ all: 0, charts: { cancel: 18 } } as any);
  const typistRes = ref({ all: 0, charts: { cancel: 18 } } as any);

  //   onMounted(() => {
  //   });

  // 渲染柱状图
  const { chartOption } = useChartOption(() => {
    return {
      tooltip: {},
      //   toolbox: {
      //     show: true,
      //     feature: {
      //       saveAsImage: {
      //         type: 'png',
      //         name: `${
      //           clusterValue.value
      //         }_Verify_Analysis_result_${getCurrentDateTime()}`,
      //       },
      //     },
      //   },
      title: [
        {
          text: 'Cancelled after supplier analysis(percentage)',
          subtext: `Total ${totalRes.value.all}`,
          textAlign: 'center',
          left: '25%',
        },
        {
          text: 'Cancel Ticket Top10',
          left: '75%',
          textAlign: 'center',
        },
      ],
      grid: [
        {
          top: '10%',
          width: '50%',
          left: '10',
          right: '25',
          containLabel: true,
        },
        {
          top: '15%',
          width: '50%',
          right: '2%',
          containLabel: true,
        },
      ],
      xAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          gridIndex: 1,
        },
      ],
      yAxis: [
        {
          gridIndex: 1,
          type: 'category',
          data: Object.keys(typistRes.value.charts as object),
          axisLabel: {
            interval: 0,
            rotate: 25,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          type: 'pie',
          radius: [0, '70%'],
          center: ['25%', '55%'],
          label: {
            position: 'outside',
            formatter: '{b}: {c} ({d}%)',
            fontSize: 12,
            color: '#4E5969',
            show: true,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },

          labelLine: {
            length: 5,
            length2: 10,
            show: true,
          },
          data: Object.entries(totalRes.value.charts as object).map(
            ([key, value]) => {
              return {
                name: key,
                value,
              };
            }
          ),
        },
        {
          type: 'bar',
          stack: 'chart',
          color: '#3B6C25',
          label: {
            position: 'right',
            show: true,
          },
          data: Object.values(typistRes.value.charts as object),
        },
      ],
    };
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryTicketStatsByCancel(
        clusterValue.value
      );
      totalRes.value = chartData.total_res;
      typistRes.value = chartData.typist_res;
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
