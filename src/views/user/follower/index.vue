<template>
  <div class="container">
    <Breadcrumb :items="['menu.workspace', 'menu.workspace.followTicket']" />
    <div class="followBox">
      <el-scrollbar
        ref="followBoxScrollBarRef"
        class="followBoxScrollBar"
        always
      >
        <template v-if="!followDetailView">
          <div class="controlBar">
            <div class="searchBar">
              <a-input
                v-model="searchTicket"
                allow-clear
                placeholder="Number/Short Text"
                @change="querySubscription"
              />
              <span
                style="margin-right: 8px; color: #7f7f7f; font-weight: bold"
              >
                Group By
              </span>
              <a-select
                v-model="groupField"
                style="width: 200px"
                placeholder="Group By"
                allow-clear
                @change="querySubscription"
              >
                <a-option value="creator" label="Creator" />
                <a-option value="cluster_type" label="Cluster" />
              </a-select>
            </div>
            <FollowerListInfo @updateFollowInfo="querySubscription" />
          </div>
          <el-scrollbar class="followStatusScrollBar">
            <div ref="ticketBoxRef" class="ticketBox">
              <div class="statusBox" :class="{ bottomShadow: ifBottomShadow }">
                <div
                  v-for="(item, key) in statusPool"
                  :key="key"
                  class="statusItem"
                >
                  {{ item + ' ' + statusTotal[key] }}
                </div>
              </div>
              <el-scrollbar class="ticketScrollBar" @scroll="ticketScroll">
                <el-collapse
                  v-if="groupField == 'creator'"
                  v-model="activeCreator"
                  class="ticketCollapse"
                >
                  <el-collapse-item
                    v-for="(creatorLabel, creator) in creatorPool"
                    :key="creator"
                    :name="creator"
                  >
                    <template #title>
                      {{ creatorLabel }}
                      <span class="groupTicketNum">
                        ({{ ticketData[creator]?.total }}
                        {{
                          ticketData[creator]?.total > 1 ? 'tickets' : 'ticket'
                        }})
                      </span>
                      <el-popconfirm
                        title="Are you sure to delete this?"
                        width="240"
                        confirm-button-text="OK"
                        cancel-button-text="No, Thanks"
                        confirm-button-type="danger"
                        @confirm="unsubscribeTicket('multiple', creator)"
                      >
                        <template #reference>
                          <a-button size="mini" shape="circle" @click.stop>
                            <icon-close />
                          </a-button>
                        </template>
                      </el-popconfirm>
                    </template>
                    <div class="ticketColumnBox">
                      <div
                        v-for="(statusLabel, status) in statusPool"
                        :key="status"
                        class="ticketColumn"
                      >
                        <template
                          v-for="(ticket, ticketId) in ticketData[creator]?.[
                            status
                          ]"
                          :key="ticketId"
                        >
                          <followTicketCard
                            :ticket="ticket"
                            @unsubTicket="unsubscribeTicket('single', ticket)"
                            @viewDetail="viewDetail"
                          />
                        </template>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
                <el-collapse
                  v-if="groupField == 'cluster_type'"
                  v-model="activeCluster"
                  class="ticketCollapse"
                >
                  <el-collapse-item
                    v-for="(clusterLabel, cluster) in clusterPool"
                    :key="cluster"
                    :name="cluster"
                  >
                    <template #title>
                      {{ clusterLabel }}
                      <span class="groupTicketNum">
                        ({{ ticketData[cluster]?.total }}
                        {{
                          ticketData[cluster]?.total > 1 ? 'tickets' : 'ticket'
                        }})
                      </span>
                      <el-popconfirm
                        title="Are you sure to delete this?"
                        width="240"
                        confirm-button-text="OK"
                        cancel-button-text="No, Thanks"
                        confirm-button-type="danger"
                        @confirm="unsubscribeTicket('multiple', cluster)"
                      >
                        <template #reference>
                          <a-button size="mini" shape="circle" @click.stop>
                            <icon-close />
                          </a-button>
                        </template>
                      </el-popconfirm>
                    </template>
                    <div class="ticketColumnBox">
                      <div
                        v-for="(statusLabel, status) in statusPool"
                        :key="status"
                        class="ticketColumn"
                      >
                        <template
                          v-for="(ticket, ticketId) in ticketData[cluster]?.[
                            status
                          ]"
                          :key="ticketId"
                        >
                          <followTicketCard
                            :ticket="ticket"
                            @unsubTicket="unsubscribeTicket('single', ticket)"
                            @viewDetail="viewDetail"
                          />
                        </template>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-scrollbar>
            </div>
          </el-scrollbar>
        </template>
        <FollowerDetailInfo
          v-if="followDetailView"
          :item="detailItem"
          @back-detail="handleBackDetail"
        />
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, nextTick } from 'vue';
  import {
    querySubBaseInfo,
    querySubTicket,
    unsubTicket,
    syncSubTicketByUser,
  } from '@/api/subscription';
  import { useUserStore } from '@/store';
  import followTicketCard from './components/follow-ticket-card.vue';
  import FollowerListInfo from './components/follower-list-info.vue';
  import FollowerDetailInfo from './components/follower-detail-info.vue';

  const userStore = useUserStore();

  const ticketBoxRef = ref<HTMLInputElement | null>(null);
  onMounted(() => {
    computeTicktetBoxWidth();
  });

  const computeTicktetBoxWidth = () => {
    const statusLength: number = Object.keys(statusPool.value).length;

    if (ticketBoxRef.value) {
      ticketBoxRef.value.style.width = `${
        statusLength * 270 + (statusLength - 1) * 16
      }px`;
    }
  };

  const groupField = ref<string>('creator');

  onMounted(async () => {
    await syncSubTicketByUser();
    await querySubscription();
  });

  const querySubscription = async () => {
    await querySubBaseInfoFunc();
    await querySubTicketFunc();
  };

  const ifBottomShadow = ref(false);
  const ticketScroll = (e: any) => {
    ifBottomShadow.value = Boolean(e.scrollTop);
  };

  const statusPool = ref<object>({});
  const creatorPool = ref<object>({});
  const clusterPool = ref<object>({});
  const activeCluster = ref<object>([]);
  const activeCreator = ref<object>([]);
  const searchTicket = ref<string>('');
  const querySubBaseInfoFunc = async () => {
    const res = await querySubBaseInfo({
      email: userStore.email ? userStore.email : '',
      group_field: groupField.value,
      search_ticket: searchTicket.value
    });
    statusPool.value = res.data.status;
    creatorPool.value = res.data.creator;
    clusterPool.value = res.data.cluster;

    if (typeof creatorPool.value === 'object' && creatorPool.value !== null) {
      activeCreator.value = Object.keys(creatorPool.value);
    }
    if (typeof clusterPool.value === 'object' && clusterPool.value !== null) {
      activeCluster.value = Object.keys(clusterPool.value);
    }

    computeTicktetBoxWidth();
  };

  interface TicketData {
    [creator: string]: {
      total: number;
      [status: number]: {
        [id: string]: {
          number: number;
          cluster_type: string;
        };
      };
    };
  }
  const ticketData = ref<TicketData>({});
  const statusTotal = ref<number>({} as any);
  const querySubTicketFunc = async () => {
    const res = await querySubTicket({
      email: userStore.email ? userStore.email : '',
      group_field: groupField.value,
      search_ticket: searchTicket.value,
    });
    ticketData.value = res.data;
    statusTotal.value = res.data.status_total;
  };

  const unsubscribeTicket = async (mode: string, category: any) => {
    const unsubParam: any = [];
    if (mode === 'multiple') {
      if (category in ticketData.value) {
        const categoryData = ticketData.value[category];
        const statusKeys = Object.keys(categoryData).filter(
          (key) => key !== 'total'
        );
        statusKeys.forEach((key: any) => {
          Object.keys(categoryData[key]).forEach((id: string) => {
            unsubParam.push({
              cluster_number: categoryData[key]?.[id]?.number,
              cluster_type: categoryData[key]?.[id]?.cluster_type,
              email: userStore.email ? userStore.email : '',
            });
          });
        });
      }
    } else if (mode === 'single') {
      unsubParam.push({
        cluster_number: category.number,
        cluster_type: category.cluster_type,
        email: userStore.email ? userStore.email : '',
      });
    }
    await unsubTicket({
      unsub_data: unsubParam,
    });
    await querySubscription();
  };

  const detailItem = ref();

  const followDetailView = ref(false);
  const handleBackDetail = () => {
    followDetailView.value = false;
  };

  const followBoxScrollBarRef = ref();
  const viewDetail = (detail: any) => {
    detailItem.value = detail;
    followDetailView.value = true;
    setTimeout(() => {
      followBoxScrollBarRef.value.update();
    }, 0);
  };
</script>

<script lang="ts">
  export default {
    name: 'FollowTicket',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 0 20px;
    height: calc(100vh - 133px);
    :deep(.arco-list-content) {
      overflow-x: hidden;
    }

    :deep(.arco-card-meta-title) {
      font-size: 14px;
    }
  }
  :deep(.arco-list-col) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :deep(.arco-list-item) {
    width: 33%;
  }

  :deep(.block-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
  :deep(.list-wrap) {
    // min-height: 140px;
    .list-row {
      align-items: stretch;
      .list-col {
        margin-bottom: 16px;
      }
    }
    :deep(.arco-space) {
      width: 100%;
      .arco-space-item {
        &:last-child {
          flex: 1;
        }
      }
    }
  }

  .followBox {
    height: calc(100% - 56px);
    background-color: #ffffff;
    box-shadow: 0 0 20px var(--color-neutral-3);
    border-radius: 5px;
    padding: 20px;
    box-sizing: border-box;
  }

  :deep(.followBoxScrollBar .el-scrollbar__view) {
    height: 100%;
  }

  .controlBar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 10px;
    .searchBar {
      display: flex;
      align-items: center;
      .arco-input-wrapper {
        width: 200px;
        margin-right: 10px;
      }
    }
  }

  .followStatusScrollBar {
    height: calc(100% - 54px);
    box-shadow: 0 1px 0 #ebeef5;
  }

  :deep(.followStatusScrollBar .el-scrollbar__view) {
    height: 100%;
  }

  .ticketScrollBar {
    height: calc(100% - 48px);
  }

  :deep(.ticketScrollBar .el-scrollbar__thumb) {
    opacity: 0;
  }

  .ticketCollapse {
    margin-top: 10px;
  }

  .groupTicketNum {
    margin-left: 10px;
    margin-right: 10px;
    color: #aaaaaa;
  }

  .ticketBox {
    height: 100%;
  }

  .statusBox {
    height: 48px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    z-index: 5;
    transition: all 0.2s;
  }

  .statusBox.bottomShadow {
    box-shadow: 0px 4px 5px -5px #626f86;
  }

  .statusItem {
    flex: 0 0 auto;
    height: 100%;
    width: 270px;
    margin-left: 16px;
    background-color: #f7f8f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #626f86;
  }

  .statusItem:nth-child(1) {
    margin-left: 0;
  }

  .ticketColumnBox {
    display: flex;
    margin-top: 10px;
  }

  .ticketColumnBox:nth-child(1) {
    margin-top: 0;
  }

  .ticketColumn {
    flex-shrink: 0;
    width: 270px;
    margin-left: 16px;
  }

  .ticketColumn:nth-child(1) {
    margin-left: 0;
  }
</style>
