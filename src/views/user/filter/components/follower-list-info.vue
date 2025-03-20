<template>
  <div class="list-wrap">
    <div>
      <template v-if="!followDetailView">
        <a-button type="primary" @click="handleBulkFollowClick">
          {{ $t('followTicket.form.bulkFollow') }}
        </a-button>

        <a-modal
          v-model:visible="visible"
          ok-text="Submit"
          cancel-text="Back"
          :esc-to-close="false"
          unmount-on-close
          :mask-closable="true"
          :on-before-ok="handleSubmit"
          fullscreen
        >
          <template #title> Add Subscription </template>
          <a-row>
            <a-col :span="12">
              <a-form :model="ticketFormModel">
                <a-textarea
                  v-model="textareaValue"
                  :auto-size="{
                    minRows: 8,
                  }"
                  placeholder="Please enter valid 7-digit or 8-digit numbers in each line."
                  allow-clear
                />
              </a-form>
              <div v-if="validationError" class="error-message">
                <span style="color: red"
                  >Please enter valid 7-digit numbers in each line.</span
                >
              </div>
            </a-col>

            <a-col :span="12">
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
            </a-col>
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
  } from '@/api/user';
  import { Pagination } from '@/types/global';
  import { useUserStore } from '@/store';
  import axios from 'axios';
  import CardWrap from './card-wrap.vue';
  import FollowerDetailInfo from './follower-detail-info.vue';

  const followDetailView = ref(false);
  const followTicketExist = ref(false);

  const renderData = ref<any[]>([]);
  const followedNumber = ref<[]>([]);
  const detailItem = ref();

  const userStore = useUserStore();

  const { loading, setLoading } = useLoading(true);
  const ticketNumberSet = ref([]);

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

  const handleSubmit = async () => {
    validationError.value = false;

    // const lines = textareaValue.value.split('\n');
    const lines = textareaValue.value
      .split('\n')
      .filter((line) => line.trim() !== '');

    console.log('tell me lines', lines);
    const isInvalid = lines.some((line) => line && !/^\d{7}$/.test(line));

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

  onMounted(() => {
    formModel.value = generateFormModel(userStore.email as string);
    fetchData({
      ...formModel.value,
      ...basePagination,
    } as unknown as TicketFollowParams).then(() => {
      followTicketExist.value = !!pagination.total;
    });
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
    if (number !== null && number !== '' && !/^\d{7}$/.test(String(number))) {
      // 如果校验不通过，显示消息提示
      Message.error('Please enter a valid Ticket number with 7 digits.');
      return; // 终止函数执行
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
</script>

<style scoped lang="less"></style>
