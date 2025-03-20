<template>
  <el-dialog
    v-model="props.ifAddUserDialog"
    title="Invite User"
    width="30%"
    align-center
    :show-close="false"
    @close="dialogClose"
    destroy-on-close
  >
    <el-form :model="addUserData" label-position="top">
      <el-form-item label="User E-mail">
        <el-input
          v-model="addUserData.userEmail"
          placeholder="Separate with commas"
          type="textarea"
          autosize
        />
      </el-form-item>
    </el-form>
    <div class="ssAddUserFailInfo">
      <Transition>
        <el-card
          class="ssAddUserFailInfoItem ssAddUserFailInfoItemNoex"
          shadow="always"
          v-if="addUserResData.non_existent?.length"
        >
          <div class="ssAddUserFailInfoTitle">
            <el-icon class="ssAddUserFailInfoTitleIcon">
              <CircleCloseFilled />
            </el-icon>
            The following users does not exist:
          </div>
          <div class="ssAddUserFailInfoContent">
            <span v-for="(item, key) in addUserResData.non_existent" :key="key">
              {{
                item +
                (key == addUserResData.non_existent.length - 1 ? '' : ', ')
              }}
            </span>
            <el-icon
              class="ssAddUserFailInfoCopybtn"
              @click="copyToClip(addUserCopyStr)"
            >
              <DocumentCopy />
            </el-icon>
          </div>
        </el-card>
      </Transition>
      <Transition>
        <el-card
          class="ssAddUserFailInfoItem ssAddUserFailInfoItemExi"
          shadow="always"
          v-if="addUserResData.existence?.length"
        >
          <div class="ssAddUserFailInfoTitle">
            <el-icon class="ssAddUserFailInfoTitleIcon">
              <WarningFilled />
            </el-icon>
            The following users already have project access:
          </div>
          <div class="ssAddUserFailInfoContent">
            <span v-for="(item, key) in addUserResData.existence" :key="key">
              {{
                item + (key == addUserResData.existence.length - 1 ? '' : ',')
              }}
            </span>
          </div>
        </el-card>
      </Transition>
      <Transition>
        <el-card
          class="ssAddUserFailInfoItem ssAddUserFailInfoItemSuccess"
          shadow="always"
          v-if="addUserResData.success?.length"
        >
          <div class="ssAddUserFailInfoTitle">
            <el-icon class="ssAddUserFailInfoTitleIcon">
              <CircleCheckFilled />
            </el-icon>
            The following users have been added successfully:
          </div>
          <div class="ssAddUserFailInfoContent">
            <span v-for="(item, key) in addUserResData.success" :key="key">
              {{ item + (key == addUserResData.success.length - 1 ? '' : ',') }}
            </span>
          </div>
        </el-card>
      </Transition>
    </div>
    <template #footer>
      <a-button type="primary" @click="addUserSubmit"> Submit </a-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { addUser } from '@/api/user-list';
import { ElNotification } from 'element-plus';

const props = defineProps({
  ticket: {
    type: Object as any,
  },
  ifAddUserDialog: {
    type: Boolean,
  },
});

const emits = defineEmits(['closeInviteDialog', 'viewDetail']);

const viewDetail = (params: any) => {
  emits('viewDetail', params);
};

interface addUserResDataStructure {
  non_existent: any;
  existence: any;
  success: any;
}
const addUserResData = ref<addUserResDataStructure>({
  non_existent: null,
  existence: null,
  success: null,
});

interface addUserDataStructure {
  userEmail: string;
}
const addUserData = ref<addUserDataStructure>({
  userEmail: '',
});

const addUserCopyStr = ref('');
const copyToClip = async (content: any) => {
  await navigator.clipboard.writeText(content);
};

const addUserSubmit = async () => {
  const addUserParam = {
    project: 4,
    user_account: addUserData.value.userEmail,
  };
  const res = (await addUser(addUserParam)).data.data;
  addUserResData.value = res;
  if (res.existence.length == 0 && res.non_existent.length == 0) {
    ElNotification({
      title: 'Successfully added!',
      type: 'success',
      duration: 4000,
    });
    dialogClose();
  } else if (res.existence.length != 0 || res.non_existent.length != 0) {
    res.non_existent.forEach((element: any, index: any) => {
      addUserCopyStr.value +=
        element + (index == res.non_existent.length - 1 ? '' : ',');
    });
    ElNotification({
      title: 'Add failed!',
      type: 'error',
      duration: 4000,
    });
  }
};

const dialogClose = () => {
  emits('closeInviteDialog');
  addUserResData.value = {
    non_existent: null,
    existence: null,
    success: null,
  };
  addUserData.value = {
    userEmail: '',
  };
};
</script>

<style scoped lang="less">
.ssAddUserFailInfoItem {
  margin-top: 20px;
  color: #666;
}

.ssAddUserFailInfoTitle {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.ssAddUserFailInfoItemNoex .ssAddUserFailInfoTitleIcon {
  color: #f56c6c;
}

.ssAddUserFailInfoItemExi .ssAddUserFailInfoTitleIcon {
  color: #e6a23c;
}

.ssAddUserFailInfoItemSuccess .ssAddUserFailInfoTitleIcon {
  color: #67c23a;
}

.ssAddUserFailInfoTitleIcon {
  margin-right: 10px;
  font-size: 18px;
}

.ssAddUserFailInfoContent {
  width: calc(30vw - 108px);
  margin-left: 28px;
}

.ssAddUserFailInfoCopybtn {
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 6px;
  color: #409eff;
}

.ssAddUserFailInfoCopybtn:hover {
  color: #a0cfff;
}

.ssAddUserFailInfoCopybtn:active {
  color: #337ecc;
}
</style>
