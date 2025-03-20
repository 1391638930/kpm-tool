<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.verificationList']" />
    <a-card class="general-card" :title="$t('menu.list.verificationList')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item
                  field="clusterType"
                  :label="$t('searchTable.form.clusterType')"
                >
                  <a-select
                    v-model="formModel.clusterType"
                    :options="clusterTypeOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="carLine"
                  :label="$t('searchTable.form.carLine')"
                >
                  <a-select
                    v-model="formModel.carline"
                    :options="carLineOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item
                  field="createdTime"
                  :label="$t('searchTable.form.createdTime')"
                >
                  <a-range-picker
                    v-model="formModel.createdTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col> -->
              <a-col :span="6">
                <a-form-item
                  field="platform"
                  :label="$t('searchTable.form.platform')"
                >
                  <a-select
                    v-model="formModel.platform"
                    :options="platformOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="rating"
                  :label="$t('searchTable.form.rating')"
                >
                  <a-select
                    v-model="formModel.rating"
                    :options="ratingOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item field="week" :label="$t('searchTable.form.week')">
                  <a-select
                    v-model="formModel.week"
                    :options="weekArray"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item
                  field="supplier"
                  :label="$t('searchTable.form.supplier')"
                >
                  <a-select
                    v-model="formModel.supplier"
                    :options="supplierArray"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item
                  field="function"
                  :label="$t('searchTable.form.function')"
                >
                  <a-select
                    v-model="formModel.function"
                    :options="functionArray"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="ffd" :label="$t('searchTable.form.ffd')">
                  <a-select
                    v-model="formModel.ffd"
                    :options="ffdArray"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item
                  field="ee_results"
                  :label="$t('searchTable.form.ee_results')"
                >
                  <a-select
                    v-model="formModel.ee_results"
                    :options="eeResultOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                    @change="handleListChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <!-- <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button> -->
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
        <a-col :span="16">
          <a-space>
            <a-tag color="#168cff"
              ><span>Update Time: {{ verifyUpdateTime }}</span></a-tag
            >
            <!-- <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload> -->
          </a-space>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a-button :loading="fileLoading" @click="handleDownloadTask">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :data="renderData"
        :bordered="false"
        :stripe="true"
        :pagination="false"
        column-resizable
      >
        <template #columns>
          <a-table-column
            :title="$t('searchTable.columns.number')"
            data-index="number"
          />
          <a-table-column
            :title="$t('searchTable.columns.project')"
            data-index="project"
          />
          <a-table-column
            :title="$t('searchTable.columns.e_project')"
            data-index="e_project"
          />
          <a-table-column
            :title="$t('searchTable.columns.ee_results')"
            data-index="ee_results"
          />

          <a-table-column
            :title="$t('searchTable.columns.rating')"
            data-index="rating"
          />

          <a-table-column
            :title="$t('searchTable.columns.year_week')"
            data-index="year_week"
          />

          <a-table-column
            :title="$t('searchTable.columns.carline')"
            data-index="carline"
          />

          <a-table-column
            :title="$t('searchTable.columns.platform')"
            data-index="platform"
          />

          <!-- <a-table-column
            :title="$t('searchTable.columns.implementation_date')"
            data-index="implementation_date"
            :width="120"
          >
          </a-table-column> -->
          <a-table-column
            :title="$t('searchTable.columns.short_text')"
            data-index="short_text"
            :ellipsis="true"
            :width="250"
            :tooltip="true"
          />
          <a-table-column
            :title="$t('searchTable.columns.update_time')"
            :width="120"
            data-index="update_time"
          />
          <a-table-column
            :title="$t('searchTable.columns.operations')"
            data-index="operations"
          >
            <template #cell="{ record }">
              <a-button
                type="text"
                size="small"
                @click="handleViewClick(record)"
              >
                {{ $t('searchTable.columns.operations.view') }}
              </a-button>
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
    <a-modal v-model:visible="moreVisible" width="auto" :hide-cancel="true">
      <template #title> Verify Detail </template>
      <a-descriptions
        :data="rowData"
        size="medium"
        layout="vertical"
        bordered
      />
      <!-- <div
        >You can cusstomize modal body text by the current situation. This modal
        will be closed immediately once you press the OK button.</div
      > -->
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import {
    queryVerifyList,
    VerifyRecord,
    VerifyParams,
    queryVerifyUpdateTime,
    queryVerifyWeekList,
  } from '@/api/list';
  import { querySupplierList, queryFunctionList } from '@/api/visualization';

  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const generateFormModel = () => {
    return {
      rating: 'all',
      clusterType: 'CL46',
      platform: 'all',
      carline: 'all',
      week: 'all',
      ee_results: 'all',
      supplier: 'all',
      function: 'all',
      ffd: 'all',
    };
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<VerifyRecord[]>([]);
  const rowData = ref([] as any);
  const moreVisible = ref(false);
  const verifyUpdateTime = ref('');
  const supplierArray = ref([] as any);
  const functionArray = ref([] as any);
  const weekArray = ref([] as any);

  // const ffdValue = ref('all');
  const ffdArray = [
    {
      label: 'ALL',
      value: 'all',
    },
    {
      label: 'MIB',
      value: 'nodb',
    },
    {
      label: 'DB',
      value: 'db',
    },
    {
      label: 'AED',
      value: 'Asterix',
    },
  ];

  const handleViewClick = (record: any) => {
    // rowData.value = record;
    // const a = Object.keys(record).map((item) => record[item]);
    const desRecord: { label: string; value: any }[] = [];
    Object.keys(record).forEach((key) => {
      desRecord.push({ label: key, value: record[key] });
    });
    rowData.value = desRecord;

    moreVisible.value = !moreVisible.value;
  };

  const formModel: { [key: string]: any } = ref(generateFormModel());
  const fileLoading = ref(false);

  const handleDownloadTask = async () => {
    fileLoading.value = true;
    axios({
      url: `/api/verify/manage/download/`,
      method: 'POST',
      responseType: 'blob', // important
      data: formModel.value,
    })
      .then((resp) => {
        const blob = new Blob([resp.data], {
          type: resp.headers['content-disposition'],
        });
        const elink = document.createElement('a');
        const [, filename] = resp.headers['content-disposition'].split('=');
        elink.download = filename;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        elink.click();
        URL.revokeObjectURL(elink.href);
        // create file link in browser's memory
      })
      .finally(() => {
        fileLoading.value = false;
      });
    // const { data } = await downloadVerifyData(formModel.value);
  };

  const fetchWeekList = async () => {
    const { data } = await queryVerifyWeekList(formModel.value.clusterType);
    // console.log(data, 'fetchWeekList');
    weekArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      weekArray.value.push({ label: val.year_week, value: val.year_week });
    });
  };

  const fetchSupplierList = async () => {
    const { data } = await querySupplierList();

    supplierArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      if (val.name === '') {
        supplierArray.value.push({
          label: 'no Supplier',
          value: 'no Supplier',
        });
      } else {
        supplierArray.value.push({ label: val.name, value: val.name });
      }
    });
  };

  const fetchFunctionList = async () => {
    const { data } = await queryFunctionList();
    functionArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      functionArray.value.push({ label: val.name, value: val.name });
    });
  };

  onMounted(() => {
    Object.keys(router.currentRoute.value.query).forEach((key) => {
      formModel.value[key] = router.currentRoute.value.query[key];
    });

    // console.log(
    //   'formModel',
    //   formModel.value,
    //   'query',
    //   router.currentRoute.value.query
    // );
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as VerifyParams);
    fetchUpdateTime();
    fetchSupplierList();
    fetchFunctionList();
    fetchWeekList();
  });

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  const pagination = reactive({
    ...basePagination,
  });

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

  const carLineOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.carLine.all'),
      value: 'all',
    },
    {
      label: t('searchTable.form.carLine.d5'),
      value: 'D5',
    },
    {
      label: t('searchTable.form.carLine.c8'),
      value: 'C8',
    },
    {
      label: t('searchTable.form.carLine.q8'),
      value: 'Q8',
    },
    {
      label: t('searchTable.form.carLine.a7'),
      value: 'A7',
    },
    {
      label: t('searchTable.form.carLine.q7'),
      value: 'Q7',
    },
    {
      label: t('searchTable.form.carLine.a3'),
      value: 'A3',
    },
  ]);
  const platformOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.carLine.all'),
      value: 'all',
    },

    {
      label: t('searchTable.form.platform.mlb'),
      value: 'MLB',
    },
    {
      label: t('searchTable.form.platform.mqb'),
      value: 'MQB',
    },
    {
      label: t('searchTable.form.platform.meb'),
      value: 'MEB',
    },
  ]);

  const eeResultOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'ALL',
      value: 'all',
    },

    {
      label: 'VOK',
      value: 'VOK',
    },

    {
      label: 'VNOK',
      value: 'VNOK',
    },
    {
      label: 'Test Block',
      value: 'Test Block',
    },
  ]);

  const ratingOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'ALL',
      value: 'all',
    },
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'B',
      value: 'B',
    },
    {
      label: 'C',
      value: 'C',
    },
    {
      label: 'D',
      value: 'D',
    },
    {
      label: 'DB',
      value: 'DB',
    },
  ]);

  const fetchData = async (
    params: VerifyParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryVerifyList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdateTime = async () => {
    const { data } = await queryVerifyUpdateTime();
    verifyUpdateTime.value = data.updateTime;
  };
  // const handleClusterChange

  const handleListChange = (param: any) => {
    if (param.indexOf('CL') !== -1) {
      fetchWeekList().then(() => {
        formModel.value.week = 'all';
        fetchData({
          ...basePagination,
          ...formModel.value,
        } as unknown as VerifyParams);
      });
    } else {
      fetchData({
        ...basePagination,
        ...formModel.value,
      } as unknown as VerifyParams);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...formModel.value,
      current,
    } as unknown as VerifyParams);
  };

  // fetchData({
  //   ...basePagination,
  //   ...formModel.value,
  // } as unknown as VerifyParams);
  const reset = () => {
    formModel.value = generateFormModel();
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as VerifyParams);
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
</style>
