<template>
  <div class="container">
    <Breadcrumb :items="['menu.workspace', 'menu.workspace.filter']" />
    <a-card class="general-card" :title="$t('menu.workspace.filterList')">
      <a-table
        row-key="id"
        :loading="loading"
        :data="renderData"
        :pagination="false"
        :bordered="true"
        :stripe="true"
        column-resizable
      >
        <template #columns>
          <a-table-column
            :title="$t('filter.columns.filter_name')"
            data-index="filter_name"
          />

          <a-table-column
            :title="$t('filter.columns.cluster')"
            data-index="cluster_type"
          />

          <a-table-column
            :title="$t('filter.columns.visibility')"
            data-index="visibility"
          />
          <a-table-column
            :title="$t('filter.columns.creator')"
            data-index="creator_email"
          />
          <a-table-column
            :title="$t('filter.columns.description')"
            data-index="description"
          />

          <a-table-column
            :title="$t('filter.columns.action')"
            data-index="action"
            :width="150"
          >
            <template #cell="{ record }">
              <a-button-group>
                <a-button size="mini" @click="handleFilterEdit(record)">
                  {{ $t('filter.columns.edit') }}
                </a-button>

                <a-popconfirm
                  content="Are you sure you want to del this filter config?"
                  @ok="handleDelFilterClick(record)"
                >
                  <a-button type="primary" size="mini">
                    {{ $t('filter.columns.del') }}
                  </a-button>
                </a-popconfirm>
              </a-button-group>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <a-row justify="end">
        <a-pagination
          :total="(pagination.total as number)"
          :current="pagination.current"
          :page-size="pagination.pageSize"
          show-total
          show-jumper
          @change="onPageChange"
        />
      </a-row>
    </a-card>
    <a-modal
      v-model:visible="moreVisible"
      width="auto"
      draggable
      @ok="handleFilterEditSubmit"
    >
      <template #title>
        {{ $t('filter.modal.edit') }}
      </template>
      <a-form :model="formModel" :style="{ width: '600px' }" auto-label-width>
        <a-form-item
          field="filter_name"
          :label="$t('filter.columns.filter_name')"
        >
          <a-input v-model="formModel.filter_name" />
        </a-form-item>

        <a-form-item field="cluster" :label="$t('filter.columns.cluster')">
          <a-select
            v-model="formModel.cluster_type"
            :options="clusterTypeOptions"
          />
        </a-form-item>
        <a-form-item
          field="visibility"
          :label="$t('filter.columns.visibility')"
        >
          <a-radio-group v-model="formModel.visibility" disabled>
            <a-radio value="private"> private</a-radio>
            <a-radio value="public"> public</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- <a-form-item
          field="visibility"
          :label="$t('filter.columns.visibility')"
        >
          <a-select
            v-model="formModel.visibility"
            :options="visibilityOptions"
          />
          <a-radio-group v-model="formModel.visibility" type="button">
        <a-radio value="mini">Mini</a-radio>
        <a-radio value="small">Small</a-radio>
        <a-radio value="medium">Medium</a-radio>
        <a-radio value="large">Large</a-radio>
      </a-radio-group>
        </a-form-item> -->

        <a-form-item
          field="creator_email"
          :label="$t('filter.columns.creator')"
        >
          <a-input v-model="formModel.creator_email" disabled />
        </a-form-item>

        <a-form-item
          field="description"
          :label="$t('filter.columns.description')"
        >
          <a-input v-model="formModel.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import {
    queryUserFilterList,
    handleDelFilter,
    UserFilterRecord,
    handleUpdateFilter,
    UserFilterParams,
  } from '@/api/user';

  import { Pagination } from '@/types/global';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const userStore = useUserStore();
  const generateFormModel = () => {
    return {
      id: undefined,
      visibility: 'private',
      creator_email: userStore.email ? userStore.email : '',
      filter_name: '',
      cluster_type: '',
      description: '',
      filter_rules: Object,
    };
  };

  const filterModel = {
    creator_email: userStore.email ? userStore.email : '',
  };

  const { t } = useI18n();

  const { loading, setLoading } = useLoading(true);
  const moreVisible = ref(false);
  const renderData = ref<UserFilterRecord[]>([]);

  const formModel: { [key: string]: any } = ref(generateFormModel());

  const handleFilterEdit = async (record: any) => {
    moreVisible.value = !moreVisible.value;
    formModel.value.visibility = record.visibility;
    formModel.value.creator_email = record.creator_email;
    formModel.value.cluster_type = record.cluster_type;
    formModel.value.filter_name = record.filter_name;
    formModel.value.description = record.description;
    formModel.value.id = record.id;
    formModel.value.filter_rules = record.filter_rules;
  };

  const visibilityOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'private',
      value: 'private',
    },
    {
      label: 'public',
      value: 'public',
    },
  ]);

  const clusterTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.clusterType.cl46'),
      value: 'CL46',
    },
    {
      label: t('searchTable.form.clusterType.cl43'),
      value: 'CL43',
    },
    {
      label: t('searchTable.form.clusterType.cl3d'),
      value: 'CL3D',
    },
    {
      label: t('searchTable.form.clusterType.cl3b'),
      value: 'CL3B',
    },
    {
      label: t('searchTable.form.clusterType.cl3a'),
      value: 'CL3A',
    },
    {
      label: t('searchTable.form.clusterType.cl39'),
      value: 'CL39',
    },
    {
      label: t('searchTable.form.clusterType.cl37'),
      value: 'CL37',
    },
    {
      label: t('searchTable.form.clusterType.cl35m2'),
      value: 'CL35.2',
    },
    {
      label: t('searchTable.form.clusterType.cl35'),
      value: 'CL35',
    },
  ]);

  const handleDelFilterClick = async (record: any) => {
    try {
      const { data } = await handleDelFilter(record.id);
      if (data === false) {
        Message.warning('ProjectBoard 正在使用当前filter, 不能删除');
      } else {
        Message.success('Del Filter Config Success!');
      }
    } catch (error) {
      Message.error('Del Filter Config Fail!');
    }
    fetchData({
      ...basePagination,
      ...filterModel,
    } as unknown as UserFilterParams);
  };

  const handleFilterEditSubmit = async () => {
    const { id, ...updateContent } = formModel.value;
    // console.log("edit subimit", id, updateContent)
    try {
      await handleUpdateFilter(formModel.value.id, updateContent);
      Message.success('Update Filter Config Success!');
    } catch (error) {
      Message.error('Update Filter Config Fail!');
    }
    fetchData({
      ...basePagination,
      ...filterModel,
    });
  };

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  const pagination = reactive({
    ...basePagination,
  });

  onMounted(() => {
    Object.keys(router.currentRoute.value.query).forEach((key) => {
      formModel.value[key] = router.currentRoute.value.query[key];
    });
    fetchData({
      ...basePagination,
      ...filterModel,
    } as unknown as UserFilterParams);
  });

  const fetchData = async (
    params: UserFilterParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUserFilterList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...filterModel,
      current,
    } as unknown as UserFilterParams);
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
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

  .equal-button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .equal-button > span {
    flex: 1;
    text-align: center;
  }

  .table-container {
    margin: 15px 0;
  }
</style>
