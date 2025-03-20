<template>
  <a-form ref="formRef" layout="vertical" :model="formModel">
    <a-space direction="vertical" :size="16">
      <a-card class="general-card">
        <template #title>
          {{ props.editType }}
          {{ $t('userInfoForm.title.userInfo') }}
        </template>
        <a-row :gutter="80">
          <a-col :span="8">
            <a-form-item
              :label="$t('userInfoForm.form.email')"
              field="email"
              :rules="[{ required: true, message: 'Email is required' }]"
              feedback
            >
              <a-input
                v-model="formModel.email"
                :placeholder="$t('userInfoForm.form.email.placeholder')"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              :label="$t('userInfoForm.form.username')"
              :rules="[{ required: true, message: 'User Name is required' }]"
              field="username"
              feedback
            >
              <a-input
                v-model="formModel.username"
                :placeholder="$t('userInfoForm.form.username.placeholder')"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="role" :label="$t('userInfoForm.form.role')">
              <a-select v-model="formModel.role" :options="roleOptions" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="80">
          <a-col :span="8">
            <a-form-item field="role" :label="$t('userInfoForm.form.group')">
              <a-select v-model="formModel.group" :options="groupOptions" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              field="role"
              :label="$t('userInfoForm.form.department')"
            >
              <a-select
                v-model="formModel.department"
                :options="departmentOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="role" :label="$t('userInfoForm.form.position')">
              <a-select
                v-model="formModel.position"
                :options="positionOptions"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="80">
          <template v-if="editType === 'Create'">
            <a-col :span="8">
              <a-form-item
                :label="$t('userInfoForm.form.password')"
                field="password"
                :rules="[{ required: true, message: 'Password is required' }]"
              >
                <a-input
                  v-model="formModel.password"
                  :placeholder="$t('userInfoForm.form.password.placeholder')"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="8">
            <a-form-item :label="$t('userInfoForm.form.phone')" field="phone">
              <a-input
                v-model="formModel.phone"
                :placeholder="$t('userInfoForm.form.phone.placeholder')"
              >
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-space>
    <div class="actions">
      <a-space>
        <a-button @click="goCancel">
          {{ $t('userInfo.editForm.back') }}
        </a-button>
        <a-button type="primary" :loading="loading" @click="onSubmitClick">
          {{ $t('userInfo.editForm.submit') }}
        </a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { createUser, updateUser } from '@/api/user';

  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    editType: {
      type: String,
      default: 'Create',
    },
    detailRecord: {
      type: Object,
    },
  });
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const emits = defineEmits(['cancelEdit']);

  const goCancel = () => {
    emits('cancelEdit');
  };

  const generateFormModel = () => {
    return {
      email: '',
      username: '',
      password: '',
      role: 'team_member',
      phone: '',
      group: '--',
      department: '--',
      position: '--',
    };
  };

  const formModel = ref(generateFormModel());

  onMounted(() => {
    nextTick(() => {
      if (props.editType === 'Create') {
        formRef.value?.resetFields();
      } else if (props.editType === 'Update') {
        if (props.detailRecord) {
          //       const desRecord: { label: string; value: any }[] = [];
          // Object.keys(record).forEach((key) => {
          //   desRecord.push({ label: key, value: record[key] });
          // });
          // rowData.value = desRecord;
          // const temp: { [key: string]: any } = {... props.detailRecord};
          // Object.keys(formModel.value).forEach((key: string) => {
          //   console.log('formModel', formModel.value, key);
          //   formModel.value[key] = temp[key];
          // });

          // formModel.value = { ...props.detailRecord };
          formModel.value.email = props.detailRecord.email;
          formModel.value.username = props.detailRecord.username;
          formModel.value.role = props.detailRecord.role;
          formModel.value.phone = props.detailRecord.phone;
          formModel.value.department = props.detailRecord.department;
          formModel.value.group = props.detailRecord.group;
          formModel.value.position = props.detailRecord.position;
          formModel.value.password = props.detailRecord.password;
        }
      }
    });
  });

  const onSubmitClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      if (props.editType === 'Create') {
        await createUser(formModel.value)
          .then(() => {
            Message.success('createUser success!');
          })
          .catch((error) => {
            Message.error('createUser error!');
          });
      } else if (props.editType === 'Update') {
        if (props.detailRecord) {
          await updateUser(props.detailRecord.id, formModel.value)
            .then(() => {
              Message.success('updateUser success!');
            })
            .catch((error) => {
              Message.error('updateUser error!');
            });
        }
      }
      setLoading(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const roleOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'team_member',
      value: 'team_member',
    },
    {
      label: 'team_admin',
      value: 'team_admin',
    },
    {
      label: 'super_admin',
      value: 'super_admin',
    },
  ]);

  const groupOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'C/EI-11',
      value: 'C/EI-11',
    },
    {
      label: 'C/EI-12',
      value: 'C/EI-12',
    },
    {
      label: '--',
      value: '--',
    },
  ]);

  const departmentOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'Asterix',
      value: 'Asterix',
    },
    {
      label: 'BMT',
      value: 'BMT',
    },
    {
      label: 'HMI',
      value: 'HMI',
    },
    {
      label: 'Multimedia & Online',
      value: 'Multimedia & Online',
    },
    {
      label: 'Navigation / DB',
      value: 'Navigation / DB',
    },
    {
      label: 'Navigation & LBS',
      value: 'Navigation & LBS',
    },
    {
      label: 'SDS',
      value: 'SDS',
    },
    {
      label: 'SE',
      value: 'SE',
    },
    {
      label: 'System',
      value: 'System',
    },
    {
      label: 'System Perf. & Stab.',
      value: 'System Perf. & Stab.',
    },
    {
      label: 'TA',
      value: 'TA',
    },
    {
      label: 'TC',
      value: 'TC',
    },
    {
      label: '--',
      value: '--',
    },
  ]);

  const positionOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'TL',
      value: 'TL',
    },
    {
      label: 'TC',
      value: 'TC',
    },
    {
      label: 'TGC',
      value: 'TGC',
    },
    {
      label: 'Tester',
      value: 'Tester',
    },
    {
      label: '--',
      value: '--',
    },
  ]);
</script>

<script lang="ts">
  export default {
    name: 'Group',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 40px 20px;
    overflow: hidden;
  }

  .actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    padding: 14px 20px 14px 0;
    background: var(--color-bg-2);
    text-align: right;
  }
</style>
