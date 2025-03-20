<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '32px', paddingTop: '32px' }"
    >
      <template #title> OpenTicketStats </template>
      <template #extra>
        <a-space direction="horizontal" size="medium">
          <a-row justify="end">
            <a-col :span="8">
              <a-form-item field="name" label="Cluster">
                <a-select
                  v-model="clusterValue"
                  :style="{ width: '320px' }"
                  placeholder="Cluster Type"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of clusterArray"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="name" label="Market">
                <a-select
                  v-model="marketValue"
                  :style="{ width: '320px' }"
                  placeholder="Cluster Type"
                  @change="selectChange"
                >
                  <a-option
                    v-for="item of marketArray"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="platform"
                :label="$t('searchTable.form.function')"
                label-col-flex="30px"
              >
                <a-select
                  v-model="functionValue"
                  :options="functionArray"
                  multiple
                  :placeholder="$t('searchTable.form.selectDefault')"
                  @change="selectChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-space>
      </template>
      <Chart
        ref="myChart"
        style="width: 100%; height: 497px"
        :option="chartOption"
        @click-chart="handleClickChart"
      />
      <!-- <button @click="downloadChart">下载图表</button> -->

      <a-modal
        v-model:visible="visible"
        cancel-text="Back"
        ok-text="Back"
        :esc-to-close="false"
        unmount-on-close
        :mask-closable="true"
        hide-cancel
        fullscreen
      >
        <template #title>
          {{ titleName }} {{ ticketStatus }} Open Ticket Info
        </template>
        <a-row>
          <a-table
            row-key="id"
            :loading="loading"
            :data="currentData"
            :pagination="false"
            :bordered="false"
            :stripe="true"
            column-resizable
          >
            <template #columns>
              <a-table-column
                :title="$t('searchTable.columns.cluster_number')"
                data-index="number"
              />
              <!-- <a-table-column
                :title="$t('searchTable.columns.cluster_type')"
                data-index="cluster_type"
              /> -->
              <a-table-column
                :title="$t('searchTable.columns.project')"
                data-index="project"
              />
              <!-- <a-table-column
                :title="$t('searchTable.columns.e_project')"
                data-index="e_project"
              /> -->
              <a-table-column
                :title="$t('searchTable.columns.rating')"
                data-index="rating"
              />
              <a-table-column
                :title="$t('searchTable.columns.status')"
                data-index="status"
              />
              <a-table-column
                :title="$t('searchTable.columns.engineering_status')"
                data-index="engineering_status"
              />
              <a-table-column
                :title="$t('searchTable.columns.l_status')"
                data-index="l_status"
              />

              <!-- <a-table-column
            :title="$t('searchTable.columns.rating')"
            data-index="rating"
          /> -->

              <!-- <a-table-column
            :title="$t('searchTable.columns.week')"
            data-index="week"
          /> -->
              <a-table-column
                :title="$t('searchTable.columns.year_week')"
                data-index="year_week"
              />
              <!-- <a-table-column
                :title="$t('searchTable.columns.carline')"
                data-index="carline"
              />

              <a-table-column
                :title="$t('searchTable.columns.platform')"
                data-index="platform"
              /> -->

              <!-- <a-table-column
            :title="$t('searchTable.columns.implementation_date')"
            data-index="implementation_date"
            :width="120"
          >
          </a-table-column> -->
              <a-table-column
                :title="$t('searchTable.columns.short_text')"
                data-index="short_text"
                :ellipsis="true"
                :width="420"
                :tooltip="true"
              />
              <!-- <a-table-column
                :title="$t('searchTable.columns.update_time')"
                :width="120"
                data-index="update_time"
              /> -->
            </template>
          </a-table>

          <a-row justify="end">
            <a-pagination
              :total="(pagination.total as number)"
              :current="pagination.current"
              :page-size="pagination.pageSize"
              show-total
              show-jumper
              @change="onPageChange"
            />
          </a-row>
        </a-row>
      </a-modal>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    ContentOpenTicketRecord,
    queryOpenTicket,
    ticketDetail
  } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { Pagination } from '@/types/global';
  import useChartOption from '@/hooks/chart-option';
  import { queryTicketFieldChangeList } from '@/api/list';

  import { getCurrentDateTime } from '@/utils/utils';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>

          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value}
        </span>
      </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(false);
  const visible = ref(false);
  const clusterValue = ref('CL46');
  const titleName = ref('');
  const functionValue = ref(['all']);
  const ticketStatus = ref('New');
  const functionArray = ref([] as any);
  const pagination: Pagination = reactive({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const currentData = ref([])

  const fetchFuncList = async () => {
    const { data: functionData } = await queryTicketFieldChangeList(
      // eslint-disable-next-line prettier/prettier
      clusterValue.value,
      'function'
    );
    functionArray.value = [{ label: 'ALL', value: 'all' }];
    functionData.forEach((val) => {
      functionArray.value.push({
        label: val,
        value: val,
      });
    });
  };

  const clusterArray = [
    {
      label: 'CL46',
      value: 'CL46',
    },
    {
      label: 'CL43',
      value: 'CL43',
    },
    {
      label: 'CL3D',
      value: 'CL3D',
    },
    {
      label: 'CL3B',
      value: 'CL3B',
    },
    {
      label: 'CL3A',
      value: 'CL3A',
    },
    {
      label: 'CL39',
      value: 'CL39',
    },
    {
      label: 'CL37',
      value: 'CL37',
    },
    {
      label: 'CL35.2',
      value: 'CL35.2',
    },
    {
      label: 'CL35',
      value: 'CL35',
    },
  ];

  const marketValue = ref('CN');
  const marketArray = [
    {
      label: 'CN',
      value: 'CN',
    },
    {
      label: 'HK',
      value: 'HK',
    },
    {
      label: 'JP',
      value: 'JP',
    },
    {
      label: 'KR',
      value: 'KR',
    },
    {
      label: 'TW',
      value: 'TW',
    },
  ];

  const xAxis = ref<string[]>([]);
  const openTicketChartsData = ref<number[]>([]);
  const beforeOpenTicketChartsData = ref<number[]>([]);
  const openTicketInfoChartsData = ref<[]>([]);
  const beforeOpenTicketInfoChartsData = ref<[]>([]);

  const yInterval = ref<number>(10);

  const { chartOption } = useChartOption((isDark) => {
    return {
      title: {
        text: `${clusterValue.value} Open Ticket Number Stats`,
        left: 'center',
        fontWeight: 'bolder',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: `${
              clusterValue.value
            }_Open_Ticket_Number_Stats_${getCurrentDateTime()}`,
            type: 'png',
            excludeComponents: ['dataZoom', 'toolbox'],
          },
        },
      },
      grid: {
        left: '40',
        right: '40',
        top: '40',
        bottom: '50',
        containLabel: true,
      },
      legend: {
        bottom: 30,
        icon: 'circle',
        textStyle: {
          color: '#4E5969',
        },
        data: ['New', 'Old'],
      },
      xAxis: {
        type: 'category',
        data: xAxis.value,
        boundaryGap: true,
        axisLine: {
          lineStyle: {
            color: isDark ? '#3f3f3f' : '#A9AEB8',
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          // lineStyle: {
          //   color: '#86909C',
          // },
          interval(idx: number) {
            if (idx === 0) return false;
            if (idx === xAxis.value.length - 1) return false;
            return true;
          },
        },
        axisLabel: {
          // formatter(value: number, idx: number) {
          //   if (idx === 0) return '';
          //   if (idx === xAxis.value.length - 1) return '';
          //   return `${value}`;
          // },
          color: '#000000',
          interval: 0,
          rotate: 40,
        },
      },
      yAxis: [
        {
          type: 'value',
          interval: yInterval.value,
          splitLine: {
            lineStyle: {
              type: 'solid',
              // color: isDark ? '#3F3F3F' : '#E5E6EB',
            },
            show: true,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
          },
        },
      ],
      tooltip: {
        trigger: 'axis', // 触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据，
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效，
          type: 'line', // 默认为line，line直线，cross十字准星，shadow阴影
          crossStyle: {
            color: '#fff',
          },
        },
        formatter(params) {
          const newParams = params as ToolTipFormatterParams[];
          if (newParams.length === 0) {
            return '';
          }
          newParams.reverse();
          const barContentStr = `<div>
            <p class="tooltip-title">${newParams[0].axisValueLabel}</p>
            ${tooltipItemsHtmlString(newParams as ToolTipFormatterParams[])}
          </div>`;

          return barContentStr;
        },
        className: 'echarts-tooltip-diy',
      },
      // 提示框取默认值，即鼠标移动到柱状图会显示内容
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'cross',
      //     crossStyle: {
      //       color: '#999',
      //     },
      //   },
      //   formatter(params) {
      //     const [firstElement, second, third, last] =
      //       params as ToolTipFormatterParams[];

      //     const barContentStr = `<div>
      //       <p class="tooltip-title">${firstElement.axisValueLabel}</p>
      //       ${tooltipItemsHtmlString([
      //         firstElement,
      //         second,
      //         third,
      //       ] as ToolTipFormatterParams[])}
      //     </div>`;

      //     const triggerStr = `<div class="content-panel">
      //     <p>
      //     <span style="background-color: ${last.color}" class="tooltip-item-icon"></span>

      //     <span style="margin-right: 20px;">${last.seriesName}</span>
      //     </p>
      //     <span class="tooltip-value">
      //     ${last.value}
      //     </span>
      //     </div>`;

      //     return barContentStr + triggerStr;
      //   },
      //   className: 'echarts-tooltip-diy',
      // },
      series: [
        {
          name: 'Old',
          data: beforeOpenTicketChartsData.value,
          stack: 'open_a',
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#3D72F6' : '#246EFF',
          color: '#00B050',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E0E3FF',
            },
          },
          label: {
            show: true,
            position: 'insideBottom',
            fontSize: 10,
          },
        },

        {
          name: 'New',

          stack: 'open_a',
          data: openTicketChartsData.value,
          // tooltip: {
          //   valueFormatter(value: number) {
          //     return `${value} °C`;
          //   },
          // },
          type: 'bar',
          barMaxWidth: 50,
          smooth: true,
          showSymbol: false,
          // color: isDark ? '#A079DC' : '#00B2FF',
          color: '#FFC000',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'none',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
          label: {
            show: true,
            position: 'inside',
            fontSize: 10,
          },
        },
      ],
      dataZoom: [
        {
          bottom: 0,
          type: 'slider',
          left: 65,
          right: 65,
          height: 14,
          start: 30,
          // textStyle: true,
          borderColor: 'transparent',
          handleSize: '20',
          handleStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 4,
          },
          brushSelect: false,
          // labelFormatter: (value) => {
          //   console.log("labelFormatter", value)
          // },
          backgroundColor: isDark ? '#313132' : '#F2F3F5',
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
        },
      ],
    };
  });

  function calculateInterval(min: number, max: number): number {
    const range = max - min;
    let interval: number;

    if (range <= 100) {
      interval = 20;
    } else if (range <= 800) {
      interval = 80;
    } else {
      interval = 200;
    }

    return interval;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      // console.log('marketValue', marketValue.value);
      const { data: chartData } = await queryOpenTicket(
        clusterValue.value,
        marketValue.value,
        functionValue.value
      );
      if (chartData.length === 0) {
        xAxis.value = [];
        openTicketChartsData.value = [];
        beforeOpenTicketChartsData.value = [];
      } else {
        let statsRange = [] as any;
        xAxis.value = chartData[0].x;
        chartData.forEach((el: ContentOpenTicketRecord) => {
          if (el.name === 'Before Open ticket') {
            beforeOpenTicketChartsData.value = el.y;
            beforeOpenTicketInfoChartsData.value = el.t as any;
            statsRange = statsRange.concat(el.y);
          } else if (el.name === 'Cur Open ticket') {
            openTicketChartsData.value = el.y;
            openTicketInfoChartsData.value = el.t as any;
            statsRange = statsRange.concat(el.y);
          }
        });

        const dataMin = Math.min(...statsRange);
        const dataMax = Math.max(...statsRange);
        yInterval.value = calculateInterval(dataMin, dataMax);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const selectChange = (param: any) => {
    if (typeof param === 'string' && param.indexOf('CL') !== -1) {
      fetchFuncList();
    }
    fetchData();
  };

  let time = ''
  let type = ''
  const getDetail = () => {
    ticketDetail(
      clusterValue.value,
      marketValue.value,
      functionValue.value,
      pagination.current,
      pagination.pageSize,
      time,
      type
    ).then((res: any) => {
      currentData.value = res.data.ticket_list
      pagination.total = res.data.dataCount
    })
  }
  const handleClickChart = (params: any) => {
    visible.value = true;
    pagination.current = 1;
    titleName.value = `CW${params.name.split('-')[1]}`;
    time = params.name
    type = params.seriesName === 'Old' ? 'Before' : 'Cur'
    getDetail()
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    getDetail();
  };

  onMounted(() => {
    fetchFuncList();
    fetchData();
  });
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
