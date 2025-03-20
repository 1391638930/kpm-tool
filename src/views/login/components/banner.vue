<template>
  <div class="banner">
    <!-- <img class="carousel-image" :src="bannerImage" /> -->
    <!-- <div class="banner-inner"> -->
    <!-- <a-carousel class="carousel" animation-name="fade"> -->
    <!-- <img class="carousel-image" :src="bannerImage" />  -->
    <!-- <div class="carousel-item"> -->
    <!-- <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div> -->
    <!-- <img class="carousel-image" :src="bannerImage" /> -->
    <!-- </div> -->
    <!-- </a-carousel> -->
    <!-- </div> -->
  </div>
</template>

<script lang="ts" setup>
  // import { computed } from 'vue';
  // import { useI18n } from 'vue-i18n';
  // import bannerImage from '@/assets/images/audi-banner.png';

  // const { t } = useI18n();
  //   {
  //     slogan: t('login.banner.slogan2'),
  //     subSlogan: t('login.banner.subSlogan2'),
  //     image: bannerImage,
  //   },
  //   {
  //     slogan: t('login.banner.slogan3'),
  //     subSlogan: t('login.banner.subSlogan3'),
  //     image: bannerImage,
  //   },
</script>

<style lang="less" scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('@/assets/images/audi-banner.png');
    // linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    background-size: cover;
    // background-repeat: no-repeat;

    &-inner {
      flex: 1;
      height: 100%;
    }
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-title {
      color: var(--color-fill-1);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }

    &-sub-title {
      margin-top: 8px;
      color: var(--color-text-3);
      font-size: 14px;
      line-height: 22px;
    }

    &-image {
      width: 550px;
      height: auto;
      // margin-top: 30px;
      background: url('@/assets/images/audi-banner.png');
    }
  }
</style>
