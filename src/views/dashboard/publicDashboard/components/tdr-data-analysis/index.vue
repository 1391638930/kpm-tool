<template>
  <div class="container">
    <div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <SeByTdr />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <SystemStableByWeek />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <TestStatsByWeek />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SeByTdr from './components/se-by-tdr.vue';
  import SystemStableByWeek from './components/system-stable-by-week.vue';
  import TestStatsByWeek from './components/test-stats-by-week.vue';
</script>

<script lang="ts">
  export default {
    name: 'TdrDataAnalysis', // If you want the include property of keep-alive to take effect, you must name the component
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
