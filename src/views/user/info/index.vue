<template>
  <div class="container">
    <Breadcrumb :items="['menu.workspace', 'menu.workspace.info']" />
    <UserInfoHeader v-if="userListView" />
    <UserListInfo v-if="userListView" @edit-info="handleEditInfo" />
    <UserDetailInfo
      v-else-if="!userListView"
      :edit-type="editType"
      :detail-record="detailRecord"
      @cancel-edit="handleEditCancel"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import UserDetailInfo from './components/user-detail-info.vue';
  import UserListInfo from './components/user-list-info.vue';
  import UserInfoHeader from './components/user-info-header.vue';

  const userListView = ref(true);
  const editType = ref('Create');
  const detailRecord = ref({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditInfo = (createOrUpdate: any, record?: any) => {
    userListView.value = false;
    editType.value = createOrUpdate;
    detailRecord.value = record;
  };

  const handleEditCancel = () => {
    userListView.value = true;
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .content {
    display: flex;
    margin-top: 12px;

    &-left {
      flex: 1;
      margin-right: 16px;
      overflow: hidden;
      // background-color: var(--color-bg-2);

      :deep(.arco-tabs-nav-tab) {
        margin-left: 16px;
      }
    }

    &-right {
      width: 332px;
    }

    .tab-pane-wrapper {
      padding: 0 16px 16px 16px;
    }
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>

<style lang="less" scoped>
  .mobile {
    .content {
      display: block;
      &-left {
        margin-right: 0;
        margin-bottom: 16px;
      }
      &-right {
        width: 100%;
      }
    }
  }
</style>
