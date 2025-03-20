<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '14px', height: '75px' }"
    >
      <Chart height="347px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { ref, watch } from 'vue';
  import { queryTicketAnalyzeChange, TicketAnalyzeRecord } from '@/api/list';

  const { loading, setLoading } = useLoading(true);

  const props = defineProps({
    item: {
      type: Object,
    },
  });

  const analyzeType = ref('supplier');

  const chartData = ref<TicketAnalyzeRecord[]>([]);

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
              text: 'Total Supplier',
              // text: $t('workplace.totalTickets'),
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
              text: chartData.value.reduce((sum, item) => sum + item.value, 0),
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
          data: chartData.value,
        },
      ],
    };
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const record = props.item as any;
      // console.log('tell me record', reco);
      const { data } = await queryTicketAnalyzeChange(
        record.cluster_type,
        record.number,
        analyzeType.value
      );

      chartData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  watch(
    () => props.item,
    (newItem, oldItem) => {
      if (newItem && Object.keys(newItem).length > 0) {
        fetchData();
      }
    },
    {
      deep: true, 
      immediate: true, 
    }
  );
</script>

<style scoped lang="less"></style>
