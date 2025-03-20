<template>
  <a-form
    ref="formRef"
    :model="formModel"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.email.required'),
        },
      ]"
    >
      <a-input
        v-model="formModel.email"
        disabled
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>

    <a-form-item
      field="username"
      :rules="[
        {
          required: true,
        },
      ]"
      :label="$t('userSetting.basicInfo.form.label.username')"
    >
      <a-input v-model="formModel.username" disabled />
    </a-form-item>

    <a-form-item
      field="role"
      :label="$t('userSetting.basicInfo.form.label.role')"
    >
      <a-select v-model="formModel.role" disabled :options="roleOptions" />
    </a-form-item>

    <a-form-item
      field="group"
      :label="$t('userSetting.basicInfo.form.label.group')"
    >
      <a-select v-model="formModel.group" :options="groupOptions" />
    </a-form-item>

    <a-form-item
      field="department"
      :label="$t('userSetting.basicInfo.form.label.department')"
    >
      <a-select v-model="formModel.department" :options="departmentOptions" />
    </a-form-item>

    <a-form-item
      field="position"
      :label="$t('userSetting.basicInfo.form.label.position')"
    >
      <a-select v-model="formModel.position" :options="positionOptions" />
    </a-form-item>

    <a-form-item
      field="phone"
      :label="$t('userSetting.basicInfo.form.label.phone')"
    >
      <a-input v-model="formModel.phone" />
    </a-form-item>

    <a-form-item
      field="profile"
      :label="$t('userSetting.basicInfo.form.label.profile')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formModel.profile"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" @click="save">
          {{ $t('userSetting.save') }}
        </a-button>
        <!-- <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button> -->
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useUserStore } from '@/store';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { updateUser } from '@/api/user';
  import { Message } from '@arco-design/web-vue';

  const formRef = ref<FormInstance>();

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
      profile: '',
    };
  };

  const formModel = ref(generateFormModel());
  const userStore = useUserStore();

  onMounted(async () => {
    formModel.value.email = userStore.email as string;
    formModel.value.username = userStore.username as string;
    formModel.value.role = userStore.role as string;
    formModel.value.phone = userStore.phone as string;
    formModel.value.department = userStore.department as string;
    formModel.value.group = userStore.group as string;
    formModel.value.position = userStore.position as string;
    formModel.value.password = userStore.password as string;
    formModel.value.profile = userStore.profile as string;
  });

  const save = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      await updateUser(userStore.userId as number, formModel.value)
        .then(() => {
          Message.success('updateUser success!');
          userStore.email = formModel.value.email;
          userStore.username = formModel.value.username;
          userStore.role = formModel.value.role;
          userStore.phone = formModel.value.phone;
          userStore.department = formModel.value.department;
          userStore.group = formModel.value.group;
          userStore.position = formModel.value.position;

          userStore.profile = formModel.value.profile;
          // formModel.value.profile = userStore.profile as string;
        })
        .catch((error) => {
          console.log('updateUser', error);
        });
      // do some thing
      // you also can use html-type to submit
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
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

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
