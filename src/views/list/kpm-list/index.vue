<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.kpmList']" />
    <template v-if="!ticketDetailView">
      <a-card class="general-card" :title="$t('menu.list.kpmList')">
        <template #extra>
          <a-tooltip
            background-color="#e2e2e2"
            :content-style="{color: 'black'}"
            :content="defaultFilterName"
          >
            <a-form-item field="filter" :label="$t('filter.option.select')">
              <a-select
                v-model="defaultFilterName"
                :style="{ width: '150px' }"
                :placeholder="$t('searchTable.form.selectDefault')"
                @change="handleFilterChange"
              >
                <a-tooltip
                  v-for="item in filterArray"
                  :key="item"
                  :content="item.label"
                  background-color="#e2e2e2"
                  :content-style="{color: 'black'}"
                >
                  <a-option ref="optionText">
                    {{ item.label }}
                  </a-option>
                </a-tooltip>
              </a-select>
            </a-form-item>
          </a-tooltip>
        </template>
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="formModel"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <!-- <a-col :span="8">
                <a-form-item
                  field="number"
                  :label="$t('searchTable.form.number')"
                >
                  <a-input
                    v-model="formModel.number"
                    :placeholder="$t('searchTable.form.number.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('searchTable.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('searchTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col> -->
                <a-col :span="4">
                  <a-form-item
                    field="clusterType"
                    :label="$t('searchTable.form.clusterType')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.clusterType"
                      :options="clusterTypeOptions"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      @change="handleListChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item
                    field="carLine"
                    :label="$t('searchTable.form.carLine')"
                    label-col-flex="30px"
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
                <a-col :span="4">
                  <a-form-item
                    field="platform"
                    :label="$t('searchTable.form.platform')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.platform"
                      :options="platformOptions"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      @change="handleListChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item
                    field="rating"
                    :label="$t('searchTable.form.rating')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.rating"
                      :options="ratingOptions"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      @change="handleListChange"
                    />
                    <!-- <a-select
                    v-model="formModel.rating"
                    :options="ratingOptions"
                    :style="{ width: '360px' }"
                    :max-tag-count="3"
                    placeholder="Please select ..."
                    multiple
                    :scrollbar="true"
                    @change="handleListChange"
                  >
                    <template #header>
                      <div style="padding: 6px 12px">
                        <a-checkbox value="1">全选</a-checkbox>
                      </div>
                    </template>
                    <template #footer>
      <div style="padding: 6px 12px;">
        <a-checkbox value="1">全选</a-checkbox>
      </div>
    </template>
                  </a-select> -->
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item
                    field="year_week"
                    :label="$t('searchTable.form.week')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.year_week"
                      :options="weekArray"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      @change="handleListChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item
                    field="platform"
                    :label="$t('searchTable.form.classify')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.classify"
                      :options="classifyOptions"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      @change="handleListChange"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="4">
                  <a-form-item
                    field="shift"
                    :label="$t('searchTable.form.shift')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.shift_status"
                      :options="shiftOptions"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      @change="handleListChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item
                    label-col-flex="30px"
                    field="number"
                    :label="$t('searchTable.form.number')"
                    :rules="[
                      {
                        type: 'number',
                        min: 1000000,
                        max: 99999999,
                        message:
                          'Number must be a seven-digit or eight-digit integer',
                      },
                    ]"
                  >
                    <a-input-number
                      v-model="formModel.number"
                      :precision="0"
                      :step="1"
                      allow-clear
                      :placeholder="$t('searchTable.form.number.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="short_text"
                    :label="$t('searchTable.form.short_text')"
                    label-col-flex="30px"
                  >
                    <a-input
                      v-model="formModel.short_text"
                      allow-clear
                      :placeholder="
                        $t('searchTable.form.short_text.placeholder')
                      "
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="problem_description"
                    :label="$t('searchTable.form.problem_description')"
                    label-col-flex="60px"
                  >
                    <a-input
                      v-model="formModel.problem_description"
                      allow-clear
                      :placeholder="
                        $t('searchTable.form.problem_description.placeholder')
                      "
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item
                    field="platform"
                    :label="$t('searchTable.form.brand')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.brand"
                      :options="brandArray"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      multiple
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    field="platform"
                    :label="$t('searchTable.form.function')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.function"
                      :options="functionArray"
                      multiple
                      :placeholder="$t('searchTable.form.selectDefault')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="platform"
                    :label="$t('searchTable.form.creator')"
                    label-col-flex="30px"
                  >
                    <a-select
                      v-model="formModel.creator"
                      :options="creatorArray"
                      :placeholder="$t('searchTable.form.selectDefault')"
                      multiple
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider style="height: 100px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
              <a-button
                type="primary"
                class="equal-button"
                @click="handleSearchChange"
              >
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button class="equal-button" @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.form.reset') }}
              </a-button>

              <a-button
                class="equal-button"
                type="primary"
                @click="saveFilterClick"
              >
                <template #icon>
                  <icon-save />
                </template>
                {{ $t('searchTable.form.save_filter') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <a-row style="margin-bottom: 16px" justify="end">
          <a-col :span="16">
            <a-tag color="#168cff"
              ><span>Update Time: {{ ticketUpdateTime }}</span></a-tag
            >
          </a-col>
          <!-- <a-col :span="16">
          <a-space>
            <a-button type="primary">
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
            </a-upload>
          </a-space>
        </a-col> -->

          <!-- <a-col :span="4">
            <a-button :loading="fileLoading" @click="handleDownloadTask">
 
              {{ $t('searchTable.operation.subscribe') }}
            </a-button>
          </a-col> -->

          <a-col :span="8" style="text-align: right">
            <a-space>
              <a-popconfirm
                content="Do you confirm subscribing to all the (filtered) data?"
                ok-text="Subscribe"
                cancel-text="No"
                :loading="loading"
                @ok="handleSubscribeTask"
              >
                <a-button type="primary" :loading="loading">
                  {{ $t('searchTable.operation.subscribe') }}
                </a-button>
              </a-popconfirm>

              <a-button :loading="fileLoading" @click="handleDownloadTask">
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('searchTable.operation.download') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-table
          row-key="id"
          :loading="loading"
          :data="renderData"
          :pagination="false"
          :bordered="true"
          :stripe="true"
          column-resizable
        >
          <template #expand-row="{ record }">
            <a-descriptions :column="2">
              <a-descriptions-item label="Short Text">
                <a-tag>{{ record.short_text }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Implementation date">
                <a-tag>{{ record.implementation_date }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="country">
                <a-tag>{{ record.country }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Date">
                <a-tag>{{ record.date }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Fault frequency">
                <a-tag>{{ record.fault_frequency }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Platform">
                <a-tag>{{ record.platform }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="HW (causing)">
                <a-tag>{{ record.hw_causing }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="SW (causing)">
                <a-tag>{{ record.sw_causing }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Creator">
                <a-tag>{{ record.creator }}</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="TypistUser">
                <a-tag>{{ record.typist_user }}</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="Coordinator">
                <a-tag>{{ record.coordinator }}</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="Coordinator user">
                <a-tag>{{ record.coordinator_user }}</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="Spclst.Coord.">
                <a-tag>{{ record.spclst_coord }}</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="Specialist coordinator user">
                <a-tag>{{ record.specialist_coordinator_user }}</a-tag>
              </a-descriptions-item>

              <a-descriptions-item label="Responsible Problem Solver">
                <a-tag>{{ record.responsible_problem_solver }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Responsible Problem Solver User">
                <a-tag>{{ record.responsible_problem_solver_user }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Update Time">
                <a-tag>{{ record.update_time }}</a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </template>

          <template #columns>
            <a-table-column
              :title="$t('searchTable.columns.cluster_number')"
              data-index="cluster_number"
            />
            <a-table-column
              :title="$t('searchTable.columns.short_text')"
              data-index="short_text"
            />
            <!-- <a-table-column
              :title="$t('searchTable.columns.project')"
              data-index="project"
            /> -->
            <a-table-column
              :title="$t('searchTable.columns.e_project')"
              data-index="e_project"
            />
            <a-table-column
              :title="$t('searchTable.columns.rating')"
              data-index="rating"
            />
            <a-table-column
              :title="$t('searchTable.columns.status')"
              data-index="status"
            />
            <a-table-column
              :title="$t('searchTable.columns.engineering_status')"
              data-index="engineering_status"
            />
            <a-table-column
              :title="$t('searchTable.columns.l_status')"
              data-index="l_status"
            />

            <!-- <a-table-column
              :title="$t('searchTable.columns.cluster_type')"
              data-index="cluster_type"
            /> -->
            <!-- <a-table-column
            :title="$t('searchTable.columns.rating')"
            data-index="rating"
          /> -->

            <!-- <a-table-column
            :title="$t('searchTable.columns.week')"
            data-index="week"
          /> -->
            <!-- <a-table-column
              :title="$t('searchTable.columns.year_week')"
              data-index="year_week"
            /> -->
            <a-table-column
              :title="$t('searchTable.columns.carline')"
              data-index="carline"
            />

            <a-table-column
              :title="$t('searchTable.columns.functionality')"
              data-index="functionality"
            />
            <!-- <a-table-column
              :title="$t('searchTable.columns.functionality')"
              data-index="functionality"
            /> -->

            <!-- <a-table-column
            :title="$t('searchTable.columns.implementation_date')"
            data-index="implementation_date"
            :width="120"
          >
          </a-table-column> -->
            <!-- <a-table-column
              :title="$t('searchTable.columns.short_text')"
              data-index="short_text"
              :ellipsis="true"
              :width="250"
              :tooltip="true"
            /> -->
            <!-- <a-table-column
              :title="$t('searchTable.columns.update_time')"
              :width="120"
              data-index="update_time"
            /> -->
            <a-table-column
              :title="$t('searchTable.columns.operations')"
              data-index="operations"
              :width="150"
            >
              <template #cell="{ record }">
                <a-button-group>
                  <template v-if="record.follow_ticket">
                    <a-button
                      size="mini"
                      status="warning"
                      @click="handleFollowClick(record)"
                    >
                      <!-- <span v-if="!record.follow_ticket">Follow</span>
                    <span v-else>Unfollow</span> -->
                      Unsubscribe
                    </a-button>
                  </template>
                  <template v-else>
                    <a-button size="mini" @click="handleFollowClick(record)">
                      <!-- <span v-if="!record.follow_ticket">Follow</span>
                    <span v-else>Unfollow</span> -->
                      Subscribe
                    </a-button>
                  </template>

                  <a-button
                    type="primary"
                    size="mini"
                    @click="handleViewClick(record)"
                  >
                    {{ $t('searchTable.columns.operations.view') }}
                  </a-button>
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
      <a-modal v-model:visible="moreVisible" width="auto" :hide-cancel="true">
        <template #title> Ticket Detail </template>
        <a-row>
          <a-col :span="4">
            <a-timeline mode="left">
              <a-timeline-item
                v-for="(item, index) in ticketChangeRecord"
                :key="index"
                :label="item.change_ts_problem"
              >
                {{ item.number }}
              </a-timeline-item>
            </a-timeline>
          </a-col>
          <a-col :span="18" :offset="2">
            <a-descriptions
              :data="rowData"
              size="medium"
              layout="vertical"
              bordered
            />
          </a-col>
        </a-row>
        <!-- <div
        >You can cusstomize modal body text by the current situation. This modal
        will be closed immediately once you press the OK button.</div
      > -->
      </a-modal>
    </template>
    <template v-else>
      <TicketDetailInfo
        :item="ticketItemDetail"
        :ticket-change-item="ticketChangeRecord"
        @back-detail="handleBackDetail"
      />
    </template>
    <a-modal
    v-model:visible="filterVisible"
      width="auto"
    :footer="false"
      draggable
    >
    <template #title>
      {{ $t('saveFilter.modal.save') }}
    </template>
    <a-form
      ref="formFilterRef"
      :model="filterModel"
      :style="{ width: '600px' }"
      auto-label-width
      @submit="handleFilterSubmit"
    >
      <a-form-item
        field="filter_name"
        :label="$t('filter.columns.filter_name')"
        :rules="[{ required: true, message: 'filter_name is required' }]"
      >
        <a-input v-model="filterModel.filter_name" />
      </a-form-item>

      <a-form-item field="visibility" :label="$t('filter.columns.visibility')">
        <!-- <a-input v-model="filterModel.visibility" /> -->
        <a-radio-group v-model="filterModel.visibility">
          <a-radio value="private">private</a-radio>
          <a-radio value="public">public</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        field="description"
        :label="$t('filter.columns.description')"
      >
        <a-input v-model="filterModel.description" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary">Save</a-button>
          <a-button @click="filterVisible = false">Cancel</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
  </div>

</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useUserStore } from '@/store';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import {
    queryTicketList,
    TicketRecord,
    TicketParams,
    queryTicketUpdateTime,
    queryTicketWeekList,
    queryTicketChangeRecord,
    subscribeAllTicket,
    queryTicketFieldChangeList,
  } from '@/api/list';

  import {
    handleAddFilter,
    followTicket,
    cancelFollowTicket,
    queryUserFilterList,
    UserFilterParams,
  } from '@/api/user';

  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { useRouter } from 'vue-router';
  import TicketDetailInfo from './components/ticket-detail-info.vue';

  const router = useRouter();
  const formFilterRef = ref<FormInstance>();

  const userStore = useUserStore();
  const generateFormModel = () => {
    return {
      rating: 'all',
      clusterType: 'CL46',
      platform: 'all',
      year_week: 'all',
      carline: 'all',
      classify: 'all',
      shift_status: 'all',
      brand: ['all'],
      function: ['all'],
      creator: ['all'],
      createdTime: [],
      short_text: '',
      number: undefined,
      problem_description: '',
      email: userStore.email ? userStore.email : '',
    };
  };

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<TicketRecord[]>([]);
  const rowData = ref([] as any);
  const moreVisible = ref(false);
  const weekArray = ref([] as any);
  const brandArray = ref([] as any);
  const creatorArray = ref([] as any);
  const functionArray = ref([] as any);
  const filterArray = ref([] as any);
  const filterRuleMapping = ref<Record<string, any>>({});
  const ticketChangeRecord = ref([] as any);
  const ticketUpdateTime = ref('');
  const ticketDetailView = ref(false);
  const ticketItemDetail = ref({} as any);
  const filterVisible = ref(false);
  const defaultFilterName = ref('');
  
  const fetchWeekList = async () => {
    const { data } = await queryTicketWeekList(formModel.value.clusterType);
    // console.log(data, 'fetchWeekList');
    weekArray.value = [{ label: 'ALL', value: 'all' }];
    data.forEach((val) => {
      weekArray.value.push({ label: val.year_week, value: val.year_week });
    });
  };

  const fetchFilterList = async () => {
    const filterEmail = {
      creator_email: userStore.email ? userStore.email : '',
    };
    const { data } = await queryUserFilterList({
      ...basePagination,
      ...filterEmail,
    } as unknown as UserFilterParams);
    const filterData = data.list;
    filterArray.value = [];
    filterData.forEach((val) => {
      filterArray.value.push({
        label: val.filter_name,
        value: val.filter_name,
      });
      filterRuleMapping.value[val.filter_name] = val.filter_rules;
    });
    defaultFilterName.value =
      filterData.length > 0 ? filterArray.value[0].label : '';
  };

  const fetchFieldChangeList = async () => {
    // let field = "brand"
    const { data: brandData } = await queryTicketFieldChangeList(
      formModel.value.clusterType,
      'brand'
    );
    brandArray.value = [{ label: 'ALL', value: 'all' }];
    brandData.forEach((val) => {
      brandArray.value.push({
        label: val,
        value: val,
      });
    });

    const { data: functionData } = await queryTicketFieldChangeList(
      // eslint-disable-next-line prettier/prettier
    formModel.value.clusterType,
      'function'
    );
    functionArray.value = [{ label: 'ALL', value: 'all' }];
    functionData.forEach((val) => {
      functionArray.value.push({
        label: val,
        value: val,
      });
    });

    const { data: creatorData } = await queryTicketFieldChangeList(
      formModel.value.clusterType,
      'creator'
    );
    creatorArray.value = [{ label: 'ALL', value: 'all' }];
    creatorData.forEach((val) => {
      creatorArray.value.push({
        label: val,
        value: val,
      });
    });
  };

  // const fetchWeekList = async () => {
  //   const { data } = await queryTicketWeekList(formModel.value.clusterType);
  //   // console.log(data, 'fetchWeekList');
  //   weekArray.value = [{ label: 'ALL', value: 'all' }];
  //   data.forEach((val) => {
  //     weekArray.value.push({ label: val.year_week, value: val.year_week });
  //   });
  // };

  const handleViewClick = async (record: any) => {
    // rowData.value = record;
    // const a = Object.keys(record).map((item) => record[item]);
    // console.log(record.)
    const { data } = await queryTicketChangeRecord(
      record.cluster_type,
      record.number
    );

    ticketChangeRecord.value = data.list;

    const desRecord: { label: string; value: any }[] = [];
    Object.keys(record).forEach((key) => {
      desRecord.push({ label: key, value: record[key] });
    });
    rowData.value = desRecord;

    // queryTicketChangeRecord

    // moreVisible.value = !moreVisible.value;
    ticketDetailView.value = true;
    ticketItemDetail.value = record;
  };

  const formModel: { [key: string]: any } = ref(generateFormModel());

  const filterModel: { [key: string]: any } = ref({
    filter_name: '',
    visibility: 'private',
    description: '',
  });

  const fileLoading = ref(false);

  const handleSubscribeTask = async () => {
    try {
      setLoading(true);
      await subscribeAllTicket(formModel.value);
      Message.success('Subscribe successfully!');
    } catch {
      Message.warning('Subscribe failed!');
      // 错误处理: 显示错误消息
      // Message.error(`订阅失败：${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTask = async () => {
    fileLoading.value = true;
    axios({
      url: `/api/ticket/manage/download/`,
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

  const handleFilterSubmit = async ({
    values,
    errors,
  }: {
    values: any;
    errors: any;
  }) => {
    // formFilterRef.value.validateField();
    // const res = await formFilterRef.value?.validate();
    // alert("hh")
    if (errors === undefined) {
      const addContent = {
        filter_name: filterModel.value.filter_name,
        visibility: filterModel.value.visibility,
        description: filterModel.value.description,
        filter_rules: {
          cluster_type: formModel.value.clusterType,
          carline: formModel.value.carline,
          platform: formModel.value.platform,
          rating: formModel.value.rating,
          year_week: formModel.value.year_week,
          classify: formModel.value.classify,
          shift: formModel.value.shift,
          number: formModel.value.number,
          short_text: formModel.value.short_text,
          description: formModel.value.description,
          brand: formModel.value.brand,
          function: formModel.value.function,
          creator: formModel.value.creator,
          shift_status: formModel.value.shift_status,
        },
        creator_email: userStore.email as string,
        cluster_type: formModel.value.clusterType,
      };
      await handleAddFilter(addContent)
        .then((resp) => {
          Message.success('Save Filter successfully!');
          fetchFilterList();
          filterVisible.value = false;
        })
        .catch((error) => {
          Message.error('Save Filter failure');
        });
    }
  };

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const handleFollowClick = async (record: any) => {
    // rowData.value = record;
    // const a = Object.keys(record).map((item) => record[item]);
    // formMOdelticket_follow.value = !ticketFollow.value;
    const followInfo = {
      cluster_number: record.cluster_number,
      cluster_type: record.cluster_type,
      email: userStore.email as string,
    };
    if (record.follow_ticket === false) {
      await followTicket(followInfo).then(() => {
        record.follow_ticket = true;
        Message.success('Subscribe ticket success!');
      });
    } else {
      await cancelFollowTicket(followInfo).then(() => {
        record.follow_ticket = false;
        Message.success('Unsubscribe ticket success!');
      });
    }
  };

  onMounted(() => {
    Object.keys(router.currentRoute.value.query).forEach((key) => {
      formModel.value[key] = router.currentRoute.value.query[key];
    });
    // fetchData({
    //   ...basePagination,
    //   ...formModel.value,
    // } as unknown as TicketParams);
    fetchUpdateTime();
    fetchWeekList();
    fetchFieldChangeList();

    fetchFilterList().then(() => handleFilterChange());
  });

  const classifyOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.classify.all'),
      value: 'all',
    },
    {
      label: t('searchTable.form.classify.regression'),
      value: 'regression',
    },
    {
      label: t('searchTable.form.classify.normal'),
      value: 'normal',
    },
  ]);

  const shiftOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.shift.all'),
      value: 'all',
    },
    {
      label: t('searchTable.form.shift.normal'),
      value: 0,
    },
    {
      label: t('searchTable.form.shift.shifted'),
      value: 1,
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

  const fetchData = async (
    params: TicketParams = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryTicketList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async () => {
    const filterRules = filterRuleMapping.value[defaultFilterName.value];
    // console.log(filterRules, 'filter_rules');
    // const { data } = await queryUserFilterList({
    //   filter_name: defaultFilterName.value,
    // });
    // console.log(data, 'd');
    // const {filter_rules} = data.list[0];
    formModel.value.clusterType = filterRules.cluster_type;
    formModel.value.carline = filterRules.carline;
    formModel.value.platform = filterRules.platform;
    formModel.value.rating = filterRules.rating;
    formModel.value.year_week = filterRules.year_week;
    formModel.value.classify = filterRules.classify;
    formModel.value.shift = filterRules.shift;
    formModel.value.number = filterRules.number;
    formModel.value.short_text = filterRules.short_text;
    formModel.value.description = filterRules.description;
    formModel.value.brand = filterRules.brand;
    formModel.value.function = filterRules.function;
    formModel.value.creator = filterRules.creator;
    formModel.value.shift_status = filterRules.shift_status;

    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as TicketParams);
  };

  const handleListChange = async (param: any) => {
    if (typeof param === 'string' && param.indexOf('CL') !== -1) {
      formModel.value.year_week = 'all';
      formModel.value.brand = ['all'];
      formModel.value.function = ['all'];
      formModel.value.creator = ['all'];

      await fetchWeekList();
      await fetchFieldChangeList();
      // fetchWeekList().then(() => {
      //   formModel.value.week = 'all';
      //   fetchData({
      //     ...basePagination,
      //     ...formModel.value,
      //   } as unknown as TicketParams);
      // });
    }
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as TicketParams);
  };

  const handleSearchChange = (param: any) => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as TicketParams);
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...formModel.value,
      current,
    } as unknown as TicketParams);
  };

  const reset = () => {
    formModel.value = generateFormModel();
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as TicketParams);
  };

  const saveFilterClick = () => {
    filterVisible.value = true;
  };

  const fetchUpdateTime = async () => {
    const { data } = await queryTicketUpdateTime();
    ticketUpdateTime.value = data.updateTime;
  };

  const handleBackDetail = () => {
    ticketDetailView.value = false;
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

  :deep(.arco-card-header) {
    height: auto !important;
    padding: 20px !important;
    border: none !important;
  }
</style>
