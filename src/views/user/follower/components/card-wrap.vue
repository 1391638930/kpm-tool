<template>
  <div class="card-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
    </a-card>
    <a-card v-else :title="title" :bordered="false" hoverable>
      <a-card-meta>
        <template #title>
          <!-- <a-typography-text style="margin-right: 10px">
            {{ title }}
          </a-typography-text> -->
          <template v-if="showTag">
            <a-tag size="small" color="green">
              <template #icon>
                <icon-check-circle-fill />
              </template>
              <span>{{ tagText }}</span>
            </a-tag>
          </template>
        </template>
        <template #description>
          {{ description }}
        </template>
      </a-card-meta>
      <template #extra>
        <!-- <a-avatar
          :size="24"
          style="margin-right: 8px; background-color: #626aea"
        >
          <icon-user />
        </a-avatar> -->
        <!-- <el-row> -->
        <a-space>
          <a-button type="outline" shape="round" @click="handleDetailClick">
            {{ detailTxt }}
          </a-button>
          <!-- </el-row> -->
          <a-popconfirm
            content="Are you sure you want to Unfollow This Ticket?"
            type="success"
            @ok="handleUnFollowClick"
          >
            <a-button type="outline" status="warning" shape="round">
              Unfollow
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { cancelFollowTicket } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    actionType: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: Boolean,
      default: false,
    },
    openTxt: {
      type: String,
      default: '',
    },
    closeTxt: {
      type: String,
      default: '',
    },
    detailTxt: {
      type: String,
      default: 'Detail',
    },
    expiresText: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    showTag: {
      type: Boolean,
      default: true,
    },
    tagText: {
      type: Number,
      default: null,
    },
    clusterType: {
      type: String,
      default: '',
    },
    clusterNumber: {
      type: Number,
      default: null,
    },
    expires: {
      type: Boolean,
      default: false,
    },
    expiresTagText: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
    },
  });

  const userStore = useUserStore();
  const emits = defineEmits(['clickDetail', 'refreshList']);
  const handleUnFollowClick = async () => {
    const followInfo = {
      cluster_number: props.clusterNumber,
      cluster_type: props.clusterType,
      email: userStore.email as string,
    };

    await cancelFollowTicket(followInfo).then(() => {
      emits('refreshList');
      Message.success('Unfollow ticket success!');
    });
  };

  const handleDetailClick = () => {
    emits('clickDetail', props.item);
  };
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
    transition: all 0.3s;
    border: 1px solid var(--color-neutral-3);
    border-radius: 4px;
    &:hover {
      transform: translateY(-4px);
      // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    }
    :deep(.arco-card) {
      height: 100%;
      border-radius: 4px;
      .arco-card-body {
        height: 100%;
        .arco-space {
          width: 100%;
          height: 100%;
          .arco-space-item {
            height: 100%;
            &:last-child {
              flex: 1;
            }
            .arco-card-meta {
              height: 100%;
              display: flex;
              flex-flow: column;
              .arco-card-meta-content {
                flex: 1;
                .arco-card-meta-description {
                  margin-top: 8px;
                  color: rgb(var(--gray-6));
                  line-height: 20px;
                  font-size: 12px;
                }
              }
              .arco-card-meta-footer {
                margin-top: 0;
              }
            }
          }
        }
      }
    }
    :deep(.arco-card-meta-title) {
      display: flex;
      align-items: center;

      // To prevent the shaking
      line-height: 28px;
    }
    :deep(.arco-skeleton-line) {
      &:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
</style>
