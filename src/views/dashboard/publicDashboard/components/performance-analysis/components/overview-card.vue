<template>
  <div class="overview-box">
    <div class="overview-box-header">
      <a-form-item field="name" label="Version">
        <a-select
          @change="onSelectChange"
          :style="{ width: '15%' }"
          placeholder="Select version"
          :default-value="optionList[0]"
        >
          <a-option v-for="item in optionList" :key="item">{{ item }}</a-option>
        </a-select>
      </a-form-item>
      <span>Top 5 Subcategory with bad performance</span>
    </div>
    <a-spin :loading="loading" style="width: 100%">
      <div class="overview-card">
        <a-card
          v-for="(item, index) in overviewList"
          :key="index + item.actual"
          hoverable
        >
          <p class="card-head">
            <span style="font-weight: bold">{{ item.subcategoryName }}</span>
          </p>
          <p>
            <span class="label">Actual: </span>
            &nbsp;<span style="font-weight: bold">{{ item.actual }}ms</span>
          </p>
          <p>
            <span class="label">Expected: </span>
            &nbsp;<span style="font-weight: bold">{{ item.expected }}ms</span>
          </p>
          <p>
            <span class="label">Percentage: </span>
            &nbsp;<span
              style="font-weight: bold"
              :style="{ color: Math.round(item.percentage * 100) >= 100 ? 'red' : '' }"
            >
              {{ Math.round(item.percentage * 100) }}%</span>
          </p>
        </a-card>
        <div v-if="overviewList.length === 0" class="no-data">No Data</div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { queyrWorstSubcategoryStats } from '@/api/visualization';
  import useLoading from '@/hooks/loading';

  const { loading, setLoading } = useLoading(true);

  const props = defineProps({
    optionList: {
      type: Array<string>,
      default() {
        return [];
      },
    },
    project: {
      type: String
    }
  });
  const checkVersion = ref('')

  type overallList = {
    actual: number,
    expected: number,
    percentage: number,
    subcategoryName: string
  }
  const overviewList: Ref<overallList[]> = ref([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queyrWorstSubcategoryStats(checkVersion.value, props.project!);
      overviewList.value = res.data
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (e: any) => {
    checkVersion.value = e
    fetchData()
  }

  watch(
    () => props.optionList,
    (newValue) => {
      const [ version ] = newValue
      checkVersion.value = version
      fetchData()
    }, {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped>
  .overview-box {
    // background-color: red;
    padding: 25px 15px 0;
    .overview-box-header {
      display: flex;
      span {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 25%);
        font-weight: bold;
        font-size: 18px;
      }
    }
    .overview-card {
      min-height: 180px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 10px;
      position: relative;
      .card-head {
        height: 30px;
        margin-bottom: 20px;
        text-align: center;
        justify-content: center;
      }
      p {
        word-break: break-all;
        text-align: center;
        .label {
        }
      }
      .no-data {
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: fit-content;
        height: fit-content;
        font-size: 20px;
        color: #cdcdcd;
      }
    }
  }
</style>
