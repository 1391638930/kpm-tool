<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '14px', height: '75px' }"
    >
      <!-- <template #title>
        {{ $t('workplace.ticketPercent') }}
      </template> -->
      <div class="steps-wrapper">
        <a-steps type="dot">
          <a-step
            v-for="(step, index) in steps"
            :key="index"
            :title="$t(step.change_field)"
            :description="formatTimestamp(step.change_time)"
          />
        </a-steps>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import { ref, watch } from 'vue';
  import { queryTicketStatusChange } from '@/api/list';

  const { loading, setLoading } = useLoading(true);

  const props = defineProps({
    item: {
      type: Object,
    },
  });

  const steps = ref({} as any);
  const fieldStatusChange = ref('supplier');

  const formatTimestamp = (timestamp: string) => {
    if (timestamp.includes('.')) {
      return timestamp.split('.')[0];
    }
    return timestamp;
  };

  const fetchData = async () => {
    setLoading(true);
    const record = props.item as any;
    try {
      const { data } = await queryTicketStatusChange(
        record.cluster_type,
        record.number,
        fieldStatusChange.value
      );
      steps.value = data.list;
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
