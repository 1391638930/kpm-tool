<template>
  <div class="container">
    <div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <OpenByTicket />
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <FlowByTicket />
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <RegressionByWeek />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <RegressionByVersion />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <CancelStatsTicket />
        </a-grid-item>
        <!-- <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <VerifyByFunc />
        </a-grid-item> -->
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import OpenByTicket from './components/open-by-ticket.vue';
  import FlowByTicket from './components/flow-by-ticket.vue';
  import CancelStatsTicket from './components/cancel-stats-ticket.vue';
  import RegressionByWeek from './components/regression-by-week.vue';
  import RegressionByVersion from './components/regression-by-version.vue';
  // import VerifyByFunc from './components/verify-by-func.vue';
</script>

<script lang="ts">
  export default {
    name: 'VerificationDataAnalysis', // If you want the include property of keep-alive to take effect, you must name the component
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
