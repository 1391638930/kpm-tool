<template>
  <a-modal @ok="updateDashboard" @cancel="cancel" @before-open="beforeOpen">
    <template #title> {{ dialogTitle() }} </template>
    <div>
      <a-form ref="updateFormRef" :model="updateFormData" layout="vertical">
        <a-form-item
          field="name"
          :rules="[{ required: true, message: 'Dashboard name is required' }]"
          :validate-trigger="['change', 'input']"
          label="Dashboard Name"
        >
          <a-input
            v-model="updateFormData.name"
            placeholder="Please enter dashboard name"
          />
        </a-form-item>
        <a-form-item field="visibility" label="Visibility">
          <a-select
            v-model="updateFormData.visibility"
            placeholder="Please select visibility"
          >
            <a-option value="private">Private</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="description" label="Description">
          <a-textarea
            v-model="updateFormData.description"
            placeholder="Please enter description"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { createDashboard, editDashboard } from '@/api/dashboard';
  import { onMounted, ref } from 'vue';
  import type { FormInstance } from '@arco-design/web-vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'create',
    },
    editDashboardData: {
      type: Object,
      default: () => {},
    },
  });

  const emit = defineEmits(['cancelDialog', 'updateDashboardList']);

  const cancel = () => {
    emit('cancelDialog');
  };

  const updateFormData = ref({
    name: '',
    visibility: 'private',
    description: '',
  });

  const beforeOpen = () => {
    // console.log('type', props.type, props.editDashboardData);
    if (props.type === 'edit') {
      updateFormData.value = JSON.parse(
        JSON.stringify(props.editDashboardData)
      ) as {
        name: string;
        visibility: string;
        description: string;
      };
    } else if (props.type === 'create') {
      updateFormData.value = {
        name: '',
        visibility: 'private',
        description: '',
      };
    }
  };

  const dialogTitle = () => {
    let title = '';
    if (props.type === 'create') {
      title = 'Create Dashboard';
    } else if (props.type === 'edit') {
      title = 'Edit Dashboard';
    }
    return title;
  };

  const updateFormRef = ref<FormInstance | null>(null);
  const updateDashboard = async () => {
    if (updateFormRef.value) {
      updateFormRef.value.validate().then(async (result) => {
        if (!result) {
          const param = {
            name: updateFormData.value.name,
            visibility: updateFormData.value.visibility,
            description: updateFormData.value.description,
          };
          if (props.type === 'create') {
            await createDashboard(param).then((res) => {
              emit('updateDashboardList');
              emit('cancelDialog');
            });
          } else if (props.type === 'edit') {
            await editDashboard(props.editDashboardData.id, param).then(
              (res) => {
                emit('updateDashboardList');
                emit('cancelDialog');
              }
            );
          }
        }
      });
    }
  };
</script>

<style scoped lang="less"></style>
