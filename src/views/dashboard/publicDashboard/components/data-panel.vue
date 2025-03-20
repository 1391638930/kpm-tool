<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
 
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster46')"
          :value="ticketRecord.CL46"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
            <!-- <icon-caret-up class="up-icon" /> -->
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster43')"
          :value="ticketRecord.CL43"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
            <!-- <icon-caret-up class="up-icon" /> -->
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster3D')"
          :value="ticketRecord.CL3D"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
            <!-- <icon-caret-up class="up-icon" /> -->
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster3A')"
          :value="ticketRecord.CL3A"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster3B')"
          :value="ticketRecord.CL3B"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster39')"
          :value="ticketRecord.CL39"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster37')"
          :value="ticketRecord.CL37"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>

    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster35.2')"
          :value="ticketRecord.CL35m2"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>

    <!-- <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
          :title="$t('publicDashboard.cluster37')"
          :value="ticketRecord.Cl37"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('publicDashboard.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item> -->

    <a-grid-item :span="24">
      <!-- <a-divider class="panel-border" /> -->
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { queryTicketStats } from '@/api/dashboard';
  import { ref } from 'vue';

  // interface Record {
  //   Cl3A: number;
  //   Cl39: number;
  //   Cl37: number;
  //   Cl35m2: number;
  // }
  const Record = () => {
    return {
      CL3A: 0,
      CL39: 0,
      CL37: 0,
      CL35m2: 0,
      CL43: 0,
      CL46: 0,
      CL3D: 0,
      CL3B: 0,
    };
  };

  const ticketRecord = ref(Record());

  const fetchData = async () => {
    try {
      const { data: statsData } = await queryTicketStats();
      ticketRecord.value = statsData;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  fetchData();
</script>

<style lang="less" scoped>
  .panel {
    margin-top: 10px;
  }
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--red-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
