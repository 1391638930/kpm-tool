<template>
  <div class="emptyBox">
    <div class="emptyWord">
      {{ $t('menu.project.emptyWord') }}
    </div>
    <a-button type="primary" @click="addProject">
      {{ $t('menu.project.addProjectBtn') }}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
  // import { ref } from 'vue';
  const emit = defineEmits(['addProject']);

  const addProject = () => {
    emit('addProject');
  };
</script>

<style scoped lang="less">
  .emptyBox {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .emptyWord {
    font-weight: bold;
    font-size: 16px;
    color: #aaaaaa;
    margin-bottom: 16px;
  }
</style>
