<template>
  <a-modal
    v-model:visible="localVisible"
    title-align="start"
    :on-before-ok="addProjectFunc"
    @cancel="handleCancel"
  >
    <template #title> New Project </template>
    <div>
      <a-form :model="projectForm" layout="vertical" auto-label-width>
        <a-form-item field="filterMapping" label="Project / Cluster / Filter">
          <a-cascader
            v-model="projectForm.filterMapping"
            :options="filterMappingOption"
            placeholder="Project / Cluster / Filter"
            allow-clear
            path-mode
          />
        </a-form-item>
        <a-form-item field="description" label="Description">
          <a-textarea
            v-model="projectForm.description"
            placeholder="Description"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { useUserStore } from '@/store';
  import { addProject, getFilterMapping } from '@/api/project';
  import debug from '@/utils/env';

  const emit = defineEmits(['closeModal', 'updateBoard']);

  const userStore = useUserStore();

  // interface CascaderOption {
  //   value: string | number;
  //   label: string;
  //   children?: CascaderOption[];
  // }

  const props = defineProps({
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
  });

  const localVisible = ref(props.visible);

  watch(
    () => props.visible,
    (newVal) => {
      localVisible.value = newVal;
    }
  );

  const handleOk = () => {};

  const handleCancel = () => {
    emit('closeModal');
  };

  const projectForm = ref({
    name: '',
    filterMapping: [],
    cluster: '',
    filter: '',
    description: '',
  });

  const filterMappingOption = ref([]);
  const getFilterMappingFunc = async () => {
    const res = await getFilterMapping({
      email: userStore.email,
    });
    filterMappingOption.value = res.data;
  };
  onMounted(async () => {
    await getFilterMappingFunc();
  });

  const addProjectFunc = async () => {
    await addProject({
      project_name: projectForm.value.filterMapping[0],
      cluster_type: projectForm.value.filterMapping[1],
      filter_name: projectForm.value.filterMapping[2],
      description: projectForm.value.description,
    }).then(() => {
      projectForm.value = {
        name: '',
        filterMapping: [],
        cluster: '',
        filter: '',
        description: '',
      };
      getFilterMappingFunc();
      emit('updateBoard');
      emit('closeModal');
      return true;
    });
  };
</script>

<style scoped lang="less"></style>
