<template>
  <div class="user-info">
    <a-card class="general-card" :title="$t('menu.workspace.info')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="email" :label="$t('userInfo.form.email')">
                  <a-input
                    v-model="formModel.email"
                    allow-clear
                    :placeholder="$t('userInfo.form.email.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="username"
                  :label="$t('userInfo.form.username')"
                >
                  <a-input
                    v-model="formModel.username"
                    allow-clear
                    :placeholder="$t('userInfo.form.username.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="handleListChange">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="goEdit('Create' as string, {})">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-space>
            <a-tooltip :content="$t('userInfo.actions.refresh')">
              <div class="action-icon" @click="search"
                ><icon-refresh size="18"
              /></div>
            </a-tooltip>
            <a-tooltip :content="$t('userInfo.actions.columnSetting')">
              <a-popover
                trigger="click"
                position="bl"
                @popup-visible-change="popupVisibleChange"
              >
                <div class="action-icon"><icon-settings size="18" /></div>
                <template #content>
                  <div id="tableSetting">
                    <div
                      v-for="(item, index) in showColumns"
                      :key="item.dataIndex"
                      class="setting"
                    >
                      <div style="margin-right: 4px; cursor: move">
                        <icon-drag-arrow />
                      </div>
                      <div>
                        <a-checkbox
                          v-model="item.checked"
                          @change="
                            handleChange($event, item as TableColumnData, index)
                          "
                        >
                        </a-checkbox>
                      </div>
                      <div class="title">
                        {{ item.title === '#' ? '序列号' : item.title }}
                      </div>
                    </div>
                  </div>
                </template>
              </a-popover>
            </a-tooltip>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :stripe="true"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>

        <template #operations="{ record }">
          <a-button type="primary" @click="goEdit('Update' as string, record)">
            update
          </a-button>
          <a-popconfirm
            content="Do you want to delete the user info?"
            ok-text="delete"
            cancel-text="No"
            type="warning"
            @ok="goDelUser(record)"
          >
            <a-button>Delete</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryUserList,
    UserRecord,
    UserParams,
    delUserInfo,
  } from '@/api/user';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Message } from '@arco-design/web-vue';

  type Column = TableColumnData & { checked?: true };

  const emits = defineEmits(['editInfo']);

  const generateFormModel = () => {
    return {
      username: '',
      email: '',
    };
  };

  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<UserRecord[]>([]);

  const goEdit = (arg: string, record?: any) => {
    emits('editInfo', arg, record);
  };

  const formModel = ref(generateFormModel());
  const basePagination: Pagination = {
    current: 1,
    pageSize: 5,
  };
  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (
    params: UserParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUserList(params);
      renderData.value = data.list;
      pagination.current = params.current;

      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  onMounted(() => {
    fetchData({
      ...basePagination,
    } as unknown as UserParams);
  });

  const handleListChange = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as UserParams);
  };

  const goDelUser = async (record: any) => {
    await delUserInfo(record.id).then(() => {
      Message.success('delUser success ');
      handleListChange();
    });
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...formModel.value,
      current,
    } as unknown as UserParams);
  };
  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as UserParams);
  };
  const reset = () => {
    formModel.value = generateFormModel();
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as UserParams);
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('userInfo.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('userInfo.columns.username'),
      dataIndex: 'username',
      slotName: 'username',
    },
    {
      title: t('userInfo.columns.email'),
      dataIndex: 'email',
      slotName: 'email',
    },
    {
      title: t('userInfo.columns.role'),
      dataIndex: 'role',
      slotName: 'role',
    },
    {
      title: t('userInfo.columns.group'),
      dataIndex: 'group',
      slotName: 'group',
    },
    {
      title: t('userInfo.columns.department'),
      dataIndex: 'department',
      slotName: 'department',
    },

    {
      title: t('userInfo.columns.position'),
      dataIndex: 'position',
      slotName: 'position',
    },
    // {
    //   title: t('userInfo.columns.phone'),
    //   dataIndex: 'phone',
    //   slotName: 'phone',
    // },
    {
      title: t('userInfo.columns.lastLogin'),
      dataIndex: 'last_login',
      slotName: 'last_login',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
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
  .user-info {
    margin-top: 12px;
  }

  .content {
    // display: flex;
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

    // &-right {
    //   width: 332px;
    // }

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
