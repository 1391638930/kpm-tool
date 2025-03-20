<template>
  <div class="container">
    <div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
          class="head-box"
        >
          <a-card class="general-card">
            <div class="head-options">
              <a-radio-group
                v-model="projectType"
                type="button"
                @change="projectChange"
              >
                <a-radio value="HCP3">HCP3</a-radio>
                <a-radio value="MIB3">MIB3</a-radio>
              </a-radio-group>

              <a-space>
                <a-button type="primary" @click="showUpload(false)">Add Result</a-button>
                <!-- <a-button type="outline" @click="showUpload(true)">Update Result</a-button> -->
              </a-space>
            </div>
          </a-card>
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <a-card class="general-card">
            <overviewCard
              :optionList="commonList.version"
              :key="commonListKey"
              :project="projectType"
            />
          </a-card>
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <statisForVersion :project="projectType" />
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <comparation
            :optionList="commonList"
            :key="commonListKey"
            :project="projectType"
          />
        </a-grid-item>

        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        >
          <overall :project="projectType" />
        </a-grid-item>
      </a-grid>
    </div>

    <uploadModal
      ref="elUploadModal"
      :isEdit="fileIsEdit"
      :defaultSelect="projectType"
      :title="fileIsEdit ? 'Update Test Result' : 'Upload Test Result'"
      @uploadSuccess="uploadSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, Ref, ref } from 'vue';
  import { queryMutiOptionList } from '@/api/visualization';
  import overviewCard from './components/overview-card.vue';
  import uploadModal from './components/upload-modal.vue';
  import statisForVersion from './components/statis-for-version.vue';
  import comparation from './components/comparation.vue';
  import overall from './components/overall-average.vue';

  const projectType: Ref<string | undefined> = ref('HCP3');

  const elUploadModal = ref()
  const fileIsEdit = ref(false)
  const showUpload = (isEdit: boolean) => {
    elUploadModal.value.visible = true
    fileIsEdit.value = isEdit
  }

  type CommonList = {
    version: Array<string>,
    function: Array<string>,
    feature: Array<string>
  }
  let commonList: CommonList = reactive({
    version: [],
    function: [],
    feature: []
  })
  const commonListKey = ref(0)

  const getCommonList = async () => {
    try {
      const res = await queryMutiOptionList(projectType.value! , 'version,function,feature')
      commonList = res.data
      commonListKey.value += 1
    } catch (err) {
      // you can report use errorHandler or other
    }
  }
  const projectChange = (value: any) => {
    getCommonList()
    projectType.value = value
  }
  getCommonList()

  const uploadSuccess = () => {
    projectType.value = undefined
    setTimeout(() => {
      projectType.value = 'HCP3'
      getCommonList()
    }, 0)
  }
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    margin: 20px 20px 0 0;
    padding-bottom: 0;

    .head-options {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
    }
  }
</style>
