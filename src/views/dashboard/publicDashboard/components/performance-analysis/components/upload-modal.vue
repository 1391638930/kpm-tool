<template>
  <a-modal
    v-model:visible="visible"
    title="Upload Test Result"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="{}" auto-label-width>
      <a-form-item field="project" label="Project">
        <a-select v-model="project" placeholder="Select project">
          <a-option>HCP3</a-option>
          <a-option>MIB3</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="file" label="File" width="200">
        <a-upload
          :auto-upload="false"
          :action="uploadUrl"
          ref="uploadRef"
          @change="onChange"
          @error="onError"
          :file-list="files"
          :limit="1"
          :data="{ result_type: isEdit ? 'update' : 'add', project: project }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="updateVisible" @before-ok="confirmUpdate" @cancel="cancelUpdate">
    <template #title>
      Notification
    </template>
    <div>Do you want to update your existing test result ?</div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    isEdit: {
      type: Boolean,
      default() {
        return false;
      },
    },
    defaultSelect: {
      type: String
    }
  });
  
  const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}api/perf/upload/`
  const visible = ref(false)
  const updateVisible = ref(false)
  const uploadRef = ref()
  const files: any = ref([])
  const project = ref('HCP3')
  const emit = defineEmits(['uploadSuccess']);

  const onChange = (fileList: any) => {
    if (fileList.length) {
      const fileName = fileList[0].file.name.split('_')[0]
      if (project.value.toLowerCase() !== fileName.toLowerCase()) {
        Message.warning('Please upload the corresponding project file.')
        return
      }
      files.value = fileList
    } else {
      files.value = [];
    }
  }

  const handleCancel = () => {
    files.value = [];
    visible.value = false;
  }

  const doUpload = async () => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', files.value[0].file);
      formData.append('verify', '0');
      formData.append('project', project.value);
      xhr.open('post', uploadUrl);
      xhr.send(formData);
      xhr.onreadystatechange = (e: any) => {
        if (e.target.readyState === 4) {
          if (e.target.status === 200) {
            Message.success('File update success.');
            emit('uploadSuccess');
            resolve(true)
          } else {
            Message.error('File update failed.');
            resolve(false);
          }
        }
      }
      xhr.onerror = (err) => {
        Message.error('Network error.');
        resolve(false);
      };
    })
  }

  const handleBeforeOk = (done: (closed: boolean) => void) => {
    if (!project.value || !files.value.length) {
      Message.warning('Please upload file.');
      done(false);
      return;
    }
    const fileName = files.value[0].file.name
    const fileType = fileName.split('.')[fileName.split('.').length - 1]
    const typeWhiteList = ['xlsx', 'xls']
    if (!typeWhiteList.includes(fileType)) {
      Message.warning('Only Excel files are allowed.');
      done(false);
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', files.value[0].file);
    formData.append('verify', '1');
    formData.append('project', project.value);
    xhr.open('post', uploadUrl);
    xhr.send(formData);

    xhr.onreadystatechange = (e: any) => {
      if (e.target.readyState === 4) {
        if (e.target.status === 200) {
          const response = JSON.parse(e.target.response)
          if (response.code === 20000 && response.msg.includes('失败')) {
            Message.error('File upload failed, please check your file.');
            done(false);
          } else if (response.code === 50000 && response.lack_fields.length) {
            Message.warning(`The file is missing the following fields: ${response.lack_fields.join(',')}.`);
            done(false);
          } else {
            if (response.verify_type === 'exist') {
              updateVisible.value = true
              done(false)
              return
            }
            doUpload().then(res => {
              if (res) {
                done(true)
                files.value = [];
              }
            })
          }
        } else {
          Message.error('File upload failed, please check your file.');
          done(false);
        }
      }
    }
  };
  
  const cancelUpdate = () => {
    updateVisible.value = false
  }

  const confirmUpdate = async (done: (closed: boolean) => void) => {
    const res = await doUpload()
    if (res) {
      done(true)
      handleCancel()
    }
  }

  watch(
    () => props.defaultSelect,
    (newValue: any) => {
      project.value = newValue
    },
  )

  const onError = (e: any) => {
    Message.warning(e.response.error);
  }

  defineExpose({
    visible
  })
</script>

<style lang="less" scoped>
/deep/.arco-upload-progress {
  display: none
}
</style>