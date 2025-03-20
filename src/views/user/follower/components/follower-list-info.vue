<template>
  <div class="list-wrap">
    <div>
      <template v-if="!followDetailView">
        <a-button type="primary" @click="handleBulkFollowClick">
          {{ $t('followTicket.form.bulkFollow') }}
        </a-button>

        <a-modal
          v-model:visible="visible"
          ok-text="Back"
          :esc-to-close="false"
          unmount-on-close
          :mask-closable="true"
          fullscreen
        >
          <template #title> Add Subscription </template>
          <a-row>
            <a-form
              ref="formFilterRef"
              :model="filterModel"
              @submit="handleFilterSubscriptionSubmit"
            >
              <a-form-item
                field="filter"
                :label-col-style="{ fontWeight: 900 }"
                :label="$t('followTicket.subscription.filter')"
              >
                <a-select
                  v-model="defaultFilterName"
                  :options="filterArray"
                  :placeholder="$t('searchTable.form.selectDefault')"
                />
              </a-form-item>

              <a-form-item>
                <a-space>
                  <a-popconfirm
                    content="Are you sure you want to add filter subscription?"
                    @ok="handleSubscriptionByFilter"
                  >
                    <a-button type="primary">Add</a-button>
                  </a-popconfirm>
                </a-space>
              </a-form-item>
            </a-form>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form :model="ticketFormModel">
                <a-form-item
                  field="filter"
                  :label-col-style="{ fontWeight: 900 }"
                  :label="$t('followTicket.subscription.ticketnumer')"
                >
                  <a-textarea
                    v-model="textareaValue"
                    :auto-size="{
                      minRows: 8,
                    }"
                    placeholder="Please enter valid 7-digit or 8-digit numbers in each line."
                    allow-clear
                  />
                </a-form-item>

                <a-form-item>
                  <a-space>
                    <a-button
                      html-type="submit"
                      type="primary"
                      @click="handleSubscriptionSubmitByNum"
                      >Add</a-button
                    >
                  </a-space>
                </a-form-item>
              </a-form>
              <div v-if="validationError" class="error-message">
                <span style="color: red"
                  >Please enter valid 7-8 digit numbers in each line.</span
                >
              </div>
            </a-col>

            <!-- <a-col :span="12">
              <a-card title="Subscribe new tickets">
                <a-list>
                  <a-list-item
                    v-for="(item, index) in followedNumber"
                    :key="index"
                  >
                    Number:{{ item[0] }} Cluster:{{ item[1] }}
                  </a-list-item>
                </a-list>
              </a-card>
            </a-col> -->
          </a-row>
        </a-modal>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    queryUserFollowList,
    TicketFollowParams,
    bulkFollowTicket,
    queryUserFilterList,
  } from '@/api/user';
  import { subscribeAllTicket } from '@/api/list';
  import { Pagination } from '@/types/global';
  import { useUserStore } from '@/store';
  import axios from 'axios';
  import CardWrap from './card-wrap.vue';
  import FollowerDetailInfo from './follower-detail-info.vue';

  const followDetailView = ref(false);
  const followTicketExist = ref(false);
  const filterArray = ref([] as any);
  const defaultFilterName = ref('');
  const filterRuleMapping = ref<Record<string, any>>({});
  const renderData = ref<any[]>([]);
  const followedNumber = ref<[]>([]);
  const detailItem = ref();

  const userStore = useUserStore();

  const { loading, setLoading } = useLoading(true);
  const ticketNumberSet = ref([]);

  const filterModel: { [key: string]: any } = ref({
    filter_name: '',
    visibility: 'private',
    description: '',
  });

  const handleFilterSubscriptionSubmit = async () => {};

  const generateFormModel = (email: string) => {
    return {
      email,
      cluster_number: null as unknown as number,
      clusterType: 'CL3A',
    };
  };

  const generateTicketFormModel = () => {
    return {
      ticketNumberSet,
    };
  };

  const generateTicketListFormModel = () => {
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

  const formTicketListModel: { [key: string]: any } = ref(
    generateTicketListFormModel()
  );

  const visible = ref(false);
  const formModel = ref(generateFormModel(userStore.email as string));
  const ticketFormModel = ref(generateTicketFormModel());
  const basePagination: Pagination = {
    current: 1,
    pageSize: 12,
  };

  const pagination = reactive({
    ...basePagination,
  });

  const textareaValue = ref('');
  const validationError = ref(false);
  const emit = defineEmits(['updateFollowInfo']);

  const handleFollowNewAdd = () => {
    emit('updateFollowInfo');
  };

  const fetchData = async (
    params: TicketFollowParams = { current: 1, pageSize: 6 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryUserFollowList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionSubmitByNum = async () => {
    validationError.value = false;

    // const lines = textareaValue.value.split('\n');
    const lines = textareaValue.value
      .split('\n')
      .filter((line) => line.trim() !== '');

    // console.log('tell me lines', lines);
    const isInvalid = lines.some((line) => line && !/^\d{7,8}$/.test(line));

    if (isInvalid) {
      validationError.value = true;
      // Message.error('Please enter valid 7-digit numbers in each line.');
      return false;
    }

    const res = await bulkFollowTicket(userStore.email as string, lines);
    const { numbers } = res as any;
    if (numbers.length !== 0) {
      followedNumber.value = numbers;
      // console.log('follow ticket', numbers);
      Message.info('Bulk Follow Ticket Successfully!');
      handleFollowNewAdd();
    } else {
      Message.warning('No Ticket is followed.');
    }
    // console.log(numbers, 'hehe', numbers.length);
    fetchData({
      ...formModel.value,
      ...basePagination,
    } as unknown as TicketFollowParams).then(() => {
      followTicketExist.value = !!pagination.total;
    });


    return false;
  };

  const handleBulkFollowClick = () => {
    textareaValue.value = '';
    followedNumber.value = [];
    visible.value = true;
  };

  const fileLoading = ref(false);
  const handleDownloadTask = async () => {
    fileLoading.value = true;
    axios({
      url: `/api/user/manage/download/`,
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

  const fetchFilterList = async () => {
    const { data } = await queryUserFilterList({
      creator_email: userStore.email as any,
      current: 1,
      pageSize: 100,
    });
    // console.log(data, 'fetchWeekList');
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

  onMounted(() => {
    formModel.value = generateFormModel(userStore.email as string);
    fetchData({
      ...formModel.value,
      ...basePagination,
    } as unknown as TicketFollowParams).then(() => {
      followTicketExist.value = !!pagination.total;
    });
    fetchFilterList();
  });

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...formModel.value,
      current,
    } as unknown as TicketFollowParams).then(() => {
      followTicketExist.value = !!pagination.total;
    });
  };

  const handleListChange = () => {
    // Message.success('updateUser success!');
    // console.log(formModel);
    formModel.value.cluster_number = null as unknown as number;
    fetchData({
      ...formModel.value,
      ...basePagination,
    } as unknown as TicketFollowParams).then(() => {
      followTicketExist.value = !!pagination.total;
    });
  };

  const handleSearchChange = async (number: any) => {
    if (
      number !== null &&
      number !== '' &&
      !/^\d{7,8}$/.test(number.toString())
    ) {
      Message.error('Please enter a valid Ticket number with 7-8 digits.');
      return;
    }
    setLoading(true);
    const params = { ...basePagination, ...formModel.value };
    try {
      const { data } = await queryUserFollowList(params);

      if (data.total === 0) {
        Message.warning(`Ticket Number ${number} Not Followed`);
      } else {
        renderData.value = data.list;
        pagination.current = params.current;
        pagination.total = data.total;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
    // fetchData({
    //   ...basePagination,
    //   ...formModel.value,
    // } as unknown as TicketFollowParams).then((resp) => {
    //   console.log('number', number, resp)
    // });
  };

 

  const handleEnterChange = async () => {
    await handleSearchChange(formModel.value.cluster_number);
  };

  const handleClickDetail = (item: any) => {
    // console.log('handleClickDetal', item);
    followDetailView.value = true;
    detailItem.value = item;
  };
  const handleBackDetail = () => {
    followDetailView.value = false;
  };

  const handleSubscriptionByFilter = async () => {
    const filterRules = filterRuleMapping.value[defaultFilterName.value];
    formTicketListModel.value.clusterType = filterRules.cluster_type;
    formTicketListModel.value.carline = filterRules.carline;
    formTicketListModel.value.platform = filterRules.platform;
    formTicketListModel.value.rating = filterRules.rating;
    formTicketListModel.value.year_week = filterRules.year_week;
    formTicketListModel.value.classify = filterRules.classify;
    formTicketListModel.value.shift = filterRules.shift;
    formTicketListModel.value.number = filterRules.number;
    formTicketListModel.value.short_text = filterRules.short_text;
    formTicketListModel.value.description = filterRules.description;
    formTicketListModel.value.brand = filterRules.brand;
    formTicketListModel.value.function = filterRules.function;
    formTicketListModel.value.creator = filterRules.creator;
    formTicketListModel.value.shift_status = filterRules.shift_status;

    try {
      await subscribeAllTicket(formTicketListModel.value);
      Message.success('Subscribe successfully!');
      handleFollowNewAdd();
    } catch {
      Message.warning('Subscribe failed!');
      // 错误处理: 显示错误消息
      // Message.error(`订阅失败：${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };


</script>

<style scoped lang="less"></style>
