<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '14px', height: '75px' }"
    >
      <template #title>
        {{ $t('publicDashboard.ticketPercent') }}
      </template>

      <Chart height="347px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { ref, computed } from 'vue';
  import { queryTicketStats } from '@/api/dashboard';

  const { loading, setLoading } = useLoading(true);
  const cl3DNumber = ref<number>(0);
  const cl46Number = ref<number>(0);
  const cl43Number = ref<number>(0);
  const cl3ANumber = ref<number>(0);
  const cl3BNumber = ref<number>(0);
  const cl35Number = ref<number>(0);
  const cl35m2Number = ref<number>(0);
  const cl37Number = ref<number>(0);
  const cl39Number = ref<number>(0);

  const totalTicketNumber = computed(
    () =>
      cl3DNumber.value +
      cl46Number.value +
      cl43Number.value +
      cl3ANumber.value +
      cl3BNumber.value +
      cl35m2Number.value +
      cl37Number.value +
      cl39Number.value +
      cl35Number.value
  );

  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        // left: 'right',
        // orient: 'center',
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: 'Total Tickets',
              // text: $t('publicDashboard.totalTickets'),
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: totalTicketNumber.value,
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: [
            {
              value: [cl46Number.value],
              name: 'Cluster46',
            },
            {
              value: [cl43Number.value],
              name: 'Cluster43',
              // itemStyle: {
              //   color: isDark ? '#3D72F6' : '#249EFF',
              // },
            },
            {
              value: [cl3DNumber.value],
              name: 'Cluster3D',
            },
            {
              value: [cl3BNumber.value],
              name: 'Cluster3B',
              // itemStyle: {
              //   color: isDark ? '#3D72F6' : '#249EFF',
              // },
            },
            {
              value: [cl3ANumber.value],
              name: 'Cluster3A',
              // itemStyle: {
              //   color: isDark ? '#3D72F6' : '#249EFF',
              // },
            },

            {
              value: [cl39Number.value],
              name: 'Cluster39',
              // itemStyle: {
              //   color: isDark ? '#6CAAF5' : '#21CCFF',
              // },
            },
            {
              value: [cl37Number.value],
              name: 'Cluster37',
              // itemStyle: {
              //   color: isDark ? '#6CAAF5' : '#21CCFF',
              // },
            },
            {
              value: [cl35m2Number.value],
              name: 'Cluster35.2',
              // itemStyle: {
              //   color: isDark ? '#A079DC' : '#313CA9',
              // },
            },
            {
              value: [cl35Number.value],
              name: 'Cluster35',
              // itemStyle: {
              //   color: isDark ? '#6CAAF5' : '#21CCFF',
              // },
            },
          ],
        },
      ],
    };
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryTicketStats();
      // console.log('stats', chartData);
      cl3DNumber.value = chartData.CL3D;
      cl46Number.value = chartData.CL46;
      cl43Number.value = chartData.CL43;
      cl35Number.value = chartData.CL35;
      cl3ANumber.value = chartData.CL3A;
      cl3BNumber.value = chartData.CL3B;
      cl35m2Number.value = chartData.CL35m2;
      cl37Number.value = chartData.CL37;
      cl39Number.value = chartData.CL39;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less"></style>
