<template>
  <div style="margin-top: 45px"></div>
  <a-card class="general-card">
    <a-row>
      <a-col :span="24">
        <a-button
          style="margin-bottom: 5px; margin-top: 15px"
          type="primary"
          @click="goBack"
        >
          <template #icon>
            <icon-arrow-left />
          </template>
          <!-- {{ $t('userInfo.editForm.back') }} -->
          Back
        </a-button>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <h2 style="text-align: center"
          >Ticket Number: {{ rawRecord.number }}</h2
        >
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="4">
        <a-timeline mode="left">
          <a-timeline-item
            v-for="(record, index) in ticketChangeItem"
            :key="index"
          >
            <a-comment
              author="Ticket Change"
              :datetime="record.change_ts_problem"
              :content="`supplier: ${record.supplier}`"
            >
              <template #actions>
                <span class="action">P-Status: {{ record.status }}</span>
                <span class="action"
                  >Engineering status: {{ record.engineering_status }}</span
                >
                <span class="action">L-Status: {{ record.l_status }}</span>
              </template>
            </a-comment>
          </a-timeline-item>
        </a-timeline>
      </a-col>
      <a-col :span="18" :offset="1">
        <a-descriptions
          :data="itemData"
          size="medium"
          layout="vertical"
          bordered
        />
      </a-col>
    </a-row>
    <!-- <a-descriptions :data="itemData" layout="horizontal" bordered /> -->
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  const props = defineProps({
    item: {
      type: Object,
    },
    ticketChangeItem: {
      type: Array as any,
    },
  });

  const emits = defineEmits(['backDetail']);
  const itemData = ref([] as any);
  const rawRecord = ref({} as any);

  onMounted(() => {
    rawRecord.value = props.item;
    const desRecord: { label: string; value: any }[] = [];
    Object.keys(rawRecord.value).forEach((key) => {
      desRecord.push({ label: key, value: rawRecord.value[key] });
    });
    itemData.value = desRecord;
  });
  const goBack = () => {
    emits('backDetail');
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 40px 20px;
    overflow: hidden;
  }

  .action {
    display: block;
    padding: 0 4px;
    color: var(--color-text-1);
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .action:hover {
    background: var(--color-fill-3);
  }
</style>
