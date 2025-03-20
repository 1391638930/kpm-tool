<template>
  <div class="container">
    <a-tabs position="left" type="line" class="tabs">
      <a-tab-pane key="1" title="Public Dashboard">
        <el-scrollbar height="100%">
          <div class="left-side">
            <div class="panel">
              <Banner />
              <DataPanel />
              <!-- <ContentChart /> -->
            </div>
            <a-grid
              :cols="24"
              :col-gap="16"
              :row-gap="16"
              style="margin-top: 16px"
            >
              <a-grid-item
                :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
              >
                <TicketByFunc />
              </a-grid-item>
              <a-grid-item
                :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
              >
                <TicketStats />
              </a-grid-item>
            </a-grid>

            <a-grid
              :cols="24"
              :col-gap="16"
              :row-gap="16"
              style="margin-top: 16px"
            >
              <a-grid-item
                :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
              >
                <TicketByWeek />
              </a-grid-item>
            </a-grid>
          </div>
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="2" title="Performance Analysis">
        <el-scrollbar height="100%">
          <PerformanceAnalysis />
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="3" title="PM Data Analysis">
        <el-scrollbar height="100%">
          <PmDataAnalysis />
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="4" title="Regression Data Analysis">
        <el-scrollbar height="100%">
          <RegressionDataAnalysis />
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="5" title="TDR Data Analysis">
        <el-scrollbar height="100%">
          <TdrDataAnalysis />
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="6" title="Verification Data Analysis">
        <el-scrollbar height="100%">
          <VerificationDataAnalysis />
        </el-scrollbar>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import Banner from './components/banner.vue';
  import DataPanel from './components/data-panel.vue';
  import TicketStats from './components/ticket-stats.vue';
  import TicketByFunc from './components/ticket-by-function.vue';
  import TicketByWeek from './components/ticket-by-week.vue';
  import PerformanceAnalysis from './components/performance-analysis/index.vue';
  import PmDataAnalysis from './components/pm-data-analysis/index.vue';
  import RegressionDataAnalysis from './components/regression-data-analysis/index.vue';
  import TdrDataAnalysis from './components/tdr-data-analysis/index.vue';
  import VerificationDataAnalysis from './components/verification-data-analysis/index.vue';
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    height: calc(100vh - 133px);
    border-radius: 5px;
    box-sizing: border-box;
  }

  .tabs {
    height: 100%;
    :deep(.arco-tabs-nav-vertical) {
      padding-top: 20px;
      background-color: var(--color-bg-1);
    }
    :deep(.arco-tabs-tab) {
      height: 40px;
      line-height: 40px;
    }
    :deep(.arco-tabs-content-list) {
      height: 100%;
    }
    :deep(.arco-tabs-content-item) {
      height: 100%;
    }
    :deep(.arco-tabs-pane) {
      height: 100%;
    }
  }

  .left-side {
    margin: 20px 20px 0 0;
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }

  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>
