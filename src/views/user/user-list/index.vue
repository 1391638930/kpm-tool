<template>
  <div class="container">
    <Breadcrumb :items="['menu.workspace', 'menu.workspace.userList']" />
    <div class="userListBox">
      <div class="userHeader">
        <div class="filter">
          <el-cascader
            v-model="departmentGroupValue"
            :options="departmentGroupOption"
            style="width: 240px; margin-right: 8px"
            clearable
            placeholder="Department / Group"
          />
          <el-input
            v-model="userNameSearchValue"
            style="width: 240px; margin-right: 8px"
            placeholder="Name"
            @keydown="userFilterKeyDown"
          />
          <a-button type="primary" @click="getUserData">
            {{ $t('userList.button.search') }}
          </a-button>
        </div>
        <a-button type="primary" @click="ifAddUserDialog = true">
          {{ $t('userList.button.inviteUser') }}
        </a-button>
      </div>
      <inviteUserDialog
        :ifAddUserDialog="ifAddUserDialog"
        @closeInviteDialog="ifAddUserDialog = false"
      />
      <el-table class="userTable" :data="userTableData">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="username" label="Name" width="180" />
        <el-table-column prop="account" label="Email" />
        <el-table-column label="Role" width="180" align="center">
          <template #default="scope">
            <template v-for="(item, key) in scope.row.role" :key="key">
              <el-tag
                v-if="roleInfo[4][item]"
                :type="item == 16 ? 'primary' : 'info'"
              >
                {{ roleInfo[4][item] }}
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="Department" width="180" align="center">
          <template #default="scope">
            {{ info.departments[scope.row.department] }}
          </template>
        </el-table-column>
        <el-table-column label="Group" width="180">
          <template #default="scope">
            {{ info.groups[scope.row.group] }}
          </template>
        </el-table-column>
        <el-table-column label="Action" width="180" align="center">
          <template #default="scope">
            <el-button
              type="success"
              :icon="Edit"
              :disabled="!ifAdmin()"
              link
              @click="openEditUserDialog(scope.row)"
            />
            <el-popconfirm
              width="230"
              confirm-button-text="OK"
              confirm-button-type="danger"
              cancel-button-text="No"
              :icon="WarningFilled"
              icon-color="#F56C6C"
              title="Are you sure to delete this?"
              @confirm="removeUser(scope.row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :icon="Remove"
                  :disabled="!ifAdmin()"
                  link
                />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="ifEditUserDialog"
        title="Edit User"
        width="30%"
        align-center
      >
        <el-form
          ref="editUserFormRef"
          :model="editUserData"
          label-position="top"
        >
          <el-form-item label="Project Role" prop="role" required>
            <el-select
              v-model="editUserData.role"
              placeholder="Project Role"
              style="width: 100%"
            >
              <template v-for="(item, key) in roleInfo[4]" :key="Number(key)">
                <el-option
                  :disabled="key == 16"
                  :label="item"
                  :value="Number(key)"
                />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <a-button type="primary" @click="editUserSubmit"> submit </a-button>
        </template>
      </el-dialog>
      <a-pagination
        class="pagination"
        :current="currentPage"
        :total="totalNum"
        :page-size="pageSize"
        show-total
        show-jumper
        show-page-size
        @change="currentPageChange"
        @page-size-change="pageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { getInfo, getUser, editUser } from '@/api/user-list';
import { useUserStore } from '@/store';
import { Edit, Remove, WarningFilled } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import inviteUserDialog from './components/invite-user-dialog.vue';

const userStore = useUserStore();

interface InfoStructure {
  departments_and_group: any;
  departments: any;
  groups: any;
  roles: any;
}
const info = ref<InfoStructure>({
  departments_and_group: {},
  departments: {},
  groups: {},
  roles: {},
});

interface roleInfoStructure {
  [key: number]: {
    [key: number]: any;
  };
}
const roleInfo = ref<roleInfoStructure>({});
onMounted(async () => {
  localStorage.setItem('info', JSON.stringify((await getInfo()).data.data));
  info.value = JSON.parse((localStorage.getItem('info') as string) || '{}');
  roleInfo.value = info.value.roles;

  formatDepartmentGroupOption();
  await getUserData();
});
interface departmentItemStructure {
  value: number;
  label: string;
  children: {
    value: number;
    label: string;
  }[];
}
const departmentGroupOption = ref<departmentItemStructure[]>([]);
const formatDepartmentGroupOption = () => {
  departmentGroupOption.value = [];
  const data = info.value.departments_and_group;

  for (const i in data) {
    const departmentItem: departmentItemStructure = {
      value: Number(i),
      label: data[i].department_name,
      children: [],
    };
    for (const j in data[i].groups) {
      departmentItem.children.push({
        value: Number(j),
        label: data[i].groups[j].group_name,
      });
    }
    departmentGroupOption.value.push(departmentItem);
  }
};

const userTableData = ref<object>([]);
const departmentGroupValue = ref<{ [key: number]: string }>([]);
const userNameSearchValue = ref<string>('');
const totalNum = ref<number>(0);
const getUserData = async () => {
  let getUserParam = {
    department: departmentGroupValue.value?.[0]
      ? [departmentGroupValue.value[0]]
      : null,
    group: departmentGroupValue.value?.[1]
      ? [departmentGroupValue.value[1]]
      : null,
    project: [4],
    page_num: currentPage.value,
    page_size: pageSize.value,
    username: userNameSearchValue.value,
  };
  const res = (await getUser(getUserParam)).data;
  userTableData.value = res?.data?.user_list;
  totalNum.value = res?.data?.total_num;
};

const currentPage = ref<number>(1);
const currentPageChange = async (e: any) => {
  currentPage.value = e;
  await getUserData();
};

const pageSize = ref<number>(20);
const pageSizeChange = async (e: any) => {
  pageSize.value = e;
  await getUserData();
};

const userFilterKeyDown = async (e: any) => {
  if (e.keyCode == 13) {
    await getUserData();
  }
};

interface editUserTargetStructure {
  unique_identifier: any;
}
const editUserTarget = ref<editUserTargetStructure>({
  unique_identifier: null,
});
interface editUserDataStructure {
  role: any;
}
const editUserData = ref<editUserDataStructure>({
  role: null,
});
const openEditUserDialog = (row: any) => {
  ifEditUserDialog.value = true;
  let userMantisRole = null;
  editUserTarget.value = JSON.parse(JSON.stringify(row));
  for (let i in row.role) {
    if (roleInfo.value[4][row.role[i]]) {
      userMantisRole = Number(row.role[i]);
    }
  }
  editUserData.value.role = userMantisRole;
};
const removeUser = async (row: any) => {
  let editUserParam = {
    project_id: 4,
    role: [],
    source_unique_identifier: JSON.parse(localStorage.getItem('userInfo')!)
      .unique_identifier,
    target_unique_identifier: row.unique_identifier,
  };
  await editUser(editUserParam);
  await getUserData();
  ElNotification({
    title: 'Successfully removed!',
    type: 'success',
    duration: 4000,
  });
};

const ifAdmin = () => {
  if (JSON.parse(localStorage.getItem('userInfo')!).role) {
    let ifAdmin = !(
      JSON.parse(localStorage.getItem('userInfo')!).role.indexOf(15) == -1
    );
    return ifAdmin || true;
  }
};

const ifAddUserDialog = ref(false);
const ifEditUserDialog = ref(false);
const editUserLoading = ref(false);
const editUserSubmit = async () => {
  let editUserParam = {
    project_id: 4,
    role: [editUserData.value.role],
    source_unique_identifier: JSON.parse(localStorage.getItem('userInfo')!)
      .unique_identifier,
    target_unique_identifier: editUserTarget.value.unique_identifier,
  };
  await editUser(editUserParam);
  ElNotification({
    title: 'Successfully submitted!',
    type: 'success',
    duration: 4000,
  });
  await getUserData();
  ifEditUserDialog.value = false;
};
</script>

<script lang="ts">
export default {
  name: 'userList',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 0 20px;
  height: calc(100vh - 133px);
}

.userListBox {
  height: calc(100% - 56px);
  background-color: #ffffff;
  box-shadow: 0 0 20px var(--color-neutral-3);
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
}

:deep(.userListBoxScrollBar .el-scrollbar__view) {
  height: 100%;
}

.userHeader {
  // height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter {
  display: flex;
  align-items: center;
}

.userTable {
  margin-top: 8px;
  height: calc(100% - 80px);
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}
</style>
