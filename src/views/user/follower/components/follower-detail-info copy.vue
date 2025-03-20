<template>
  <a-space direction="vertical" :size="16">
    <a-card class="general-card">
      <div style="margin-top: 15px"></div>
      <a-row>
        <a-col :span="6">
          <a-button style="margin-bottom: 5px" type="primary" @click="goBack">
            <template #icon>
              <icon-arrow-left />
            </template>
            {{ $t('userInfo.editForm.back') }}
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

      <a-descriptions :data="itemData" layout="horizontal" bordered />
    </a-card>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  const props = defineProps({
    item: {
      type: Object,
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

  .actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    padding: 14px 20px 14px 0;
    background: var(--color-bg-2);
    text-align: right;
  }
</style>
