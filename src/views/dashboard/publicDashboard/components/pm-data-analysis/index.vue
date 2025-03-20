<template>
  <div class="container">
    <div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <TicketStatusOverall />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <PmByApk />
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <FlowByWeek />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import PmByApk from './components/pm-by-apk.vue';
  import FlowByWeek from './components/flow-by-week.vue';
  import TicketStatusOverall from './components/ticket-status-overall.vue';
</script>

<script lang="ts">
  export default {
    name: 'PMDataAnalysis', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    margin: 20px 20px 0 0;
    padding-bottom: 0;
    // display: flex;
  }

  // .title-fix {
  //   margin: 0 0 12px 0;
  //   font-size: 14;
  // }
  // :deep(.section-titile) {
  //   margin: 0 0 12px 0;
  //   font-size: 14px;
  // }
</style>
