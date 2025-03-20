<template>
  <div class="container">
    <Breadcrumb :items="['menu.workspace', 'menu.workspace.ticketStats']" />
    <div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <StatsByUser />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import StatsByUser from './components/stats-by-user.vue';
</script>

<script lang="ts">
  export default {
    name: 'TicketStatsAnalysis', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
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
