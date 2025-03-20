<template>
  <div>
    <a-col :span="24">
      <a-button
        style="margin-bottom: 5px; margin-top: 15px"
        type="primary"
        class="back-button"
        @click="goBack"
      >
        <template #icon>
          <icon-arrow-left />
        </template>
        <!-- {{ $t('userInfo.editForm.back') }} -->
        Back
      </a-button>
    </a-col>
    <a-row :gutter="10" justify="space-between">
      <a-col :span="8">
        <div hoverable class="status-container">
          <a-row :gutter="60">
            <a-col :span="8">
              <svg
                version="1.1"
                width="60"
                height="60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="30"
                  cy="30"
                  fill="#FFFFFF"
                  r="30"
                  stroke="#797979"
                  stroke-width="1"
                />
                <line
                  x1="30"
                  x2="30"
                  y1="0"
                  y2="60"
                  fill="#660F0F"
                  stroke="#660F0F"
                  stroke-width="2"
                />
                <line
                  x1="0"
                  x2="60"
                  y1="30"
                  y2="30"
                  fill="#660F0F"
                  stroke="#660F0F"
                  stroke-width="2"
                />
                <circle
                  cx="30"
                  cy="30"
                  fill="#FFFFFF"
                  r="17.5"
                  stroke="#797979"
                  stroke-width="1"
                />
                <text
                  x="30"
                  y="30"
                  font-size="20"
                  fill="#014667"
                  text-anchor="middle"
                  alignment-baseline="central"
                >
                  {{ rawRecord.status }}
                </text>
              </svg>
              <div class="status-text">
                <span> P-Status</span>
              </div>
            </a-col>
            <a-col :span="8">
              <svg
                version="1.1"
                width="60"
                height="60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="30"
                  cy="30"
                  fill="#FFFFFF"
                  r="30"
                  stroke="#797979"
                  stroke-width="1"
                />
                <line
                  x1="30"
                  x2="30"
                  y1="0"
                  y2="60"
                  fill="#660F0F"
                  stroke="#660F0F"
                  stroke-width="2"
                />
                <line
                  x1="0"
                  x2="60"
                  y1="30"
                  y2="30"
                  fill="#660F0F"
                  stroke="#660F0F"
                  stroke-width="2"
                />
                <circle
                  cx="30"
                  cy="30"
                  fill="#FFFFFF"
                  r="17.5"
                  stroke="#797979"
                  stroke-width="1"
                />
                <text
                  x="30"
                  y="30"
                  font-size="20"
                  fill="#014667"
                  text-anchor="middle"
                  alignment-baseline="central"
                >
                  {{ rawRecord.engineering_status }}
                </text>
              </svg>
              <div class="status-text">
                <span style="margin-left: -15px"> Engineering status</span>
              </div>
            </a-col>
            <a-col :span="8">
              <svg
                version="1.1"
                width="60"
                height="60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="30"
                  cy="30"
                  fill="#FFFFFF"
                  r="30"
                  stroke="#797979"
                  stroke-width="1"
                />
                <line
                  x1="30"
                  x2="30"
                  y1="0"
                  y2="60"
                  fill="#660F0F"
                  stroke="#660F0F"
                  stroke-width="2"
                />
                <line
                  x1="0"
                  x2="60"
                  y1="30"
                  y2="30"
                  fill="#660F0F"
                  stroke="#660F0F"
                  stroke-width="2"
                />
                <circle
                  cx="30"
                  cy="30"
                  fill="#FFFFFF"
                  r="17.5"
                  stroke="#797979"
                  stroke-width="1"
                />
                <text
                  x="30"
                  y="30"
                  font-size="20"
                  fill="#014667"
                  text-anchor="middle"
                  alignment-baseline="central"
                >
                  {{ rawRecord.l_status }}
                </text>
              </svg>
              <div class="status-text">
                <span> L-Status</span>
              </div>
            </a-col>
          </a-row>
        </div>

        <div>
          <a-card style="margin-top: 15px" title="Ticket Change">
            <a-timeline
              mode="alternate"
              label-position="same"
              style="margin-bottom: 15px"
            >
              <a-timeline-item dot-color="#00B42A">
                {{ rawRecord.typist_user }}
                <template #label>
                  Create:
                  <a-tag>
                    <template #icon>
                      <icon-clock-circle />
                    </template>
                    {{ rawRecord.date }}
                  </a-tag>
                </template>
              </a-timeline-item>
              <a-timeline-item
                v-for="(record, index) in ticketChangeItem"
                :key="index"
                line-type="dashed"
              >
                <a-tag>
                  <template #icon>
                    <icon-clock-circle />
                  </template>
                  {{ formatTimestamp(record.change_ts_problem) }}
                </a-tag>

                <template #label>
                  Supplier:
                  <a-tag color="blue"> {{ record.supplier }} </a-tag>
                  <br />
                  <a-space style="margin-top: 10px">
                    <a-popover>
                      <a-button type="outline" shape="circle" status="normal">
                        {{ record.status }}
                      </a-button>
                      <template #content> P-Status </template>
                    </a-popover>
                    <a-popover>
                      <a-button type="outline" shape="circle" status="warning">
                        {{ record.engineering_status }}
                      </a-button>
                      <template #content> Engineering status </template>
                    </a-popover>
                    <a-popover>
                      <a-button type="outline" shape="circle" status="success">
                        {{ record.l_status }}
                      </a-button>
                      <template #content> L-Status </template>
                    </a-popover>
                  </a-space>
                </template>
              </a-timeline-item>
              <a-timeline-item line-type="solid" line-color="red">
                <template #label>
                  <a-tag color="red">
                    <template #icon>
                      <icon-arrow-fall />
                    </template>
                    To Be Updated...
                  </a-tag>
                </template>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </div>
      </a-col>
      <a-col :span="16">
        <div class="header-info">
          <a-row justify="start" class="row-spacing" align="center">
            <a-col :offset="1" :span="6">
              <span class="span-spacing text-right-align">Rating</span>
              <a-select
                :style="{ width: '160px' }"
                :input-value="rawRecord.rating"
                disabled
              >
              </a-select>
            </a-col>
            <a-col :offset="1" :span="6">
              <span class="span-spacing text-right-align">From</span>
              <span class="span-spacing">{{ rawRecord.date }}</span>
              <span class="span-spacing">CW</span>
              <span>{{ rawRecord.year_week }}</span>
            </a-col>
          </a-row>
          <a-row justify="start" align="center">
            <a-col :offset="1" :span="12">
              <span class="span-spacing text-right-align">Short Text</span>
              <span>{{ rawRecord.short_text }}</span>
            </a-col>
          </a-row>

          <a-row
            justify="start"
            align="center"
            style="margin-top: 30px; font-size: 20px"
          >
            <span>Problem Data: {{ rawRecord.number }} </span>
          </a-row>
        </div>
        <a-card hoverable style="margin-top: 15px">
          <a-tabs>
            <a-tab-pane key="1">
              <template #title> <icon-calendar /> Data Content </template>

              <!-- <a-divider :size="2" :margin="1" type="solid" orientation="left"
                >Fault coding</a-divider
              > -->
              <a-divider
                :size="2"
                style="margin-top: 10px; margin-bottom: 10px"
                type="solid"
                orientation="left"
                >Fault coding</a-divider
              >
              <div style="margin-top: 50px"></div>
              <a-form :model="rawRecord" :content-flex="false">
                <a-row :gutter="16">
                  <a-col :span="7" :offset="1">
                    <a-form-item label="E-Project" label-col-flex="110px">
                      <span class="highlighted-text">{{
                        rawRecord.e_project
                      }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="16">
                    <a-form-item label="Country" label-col-flex="110px">
                      <span class="highlighted-text">{{
                        rawRecord.country
                      }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="7" :offset="1">
                    <a-form-item label="Reproducible" label-col-flex="110px">
                      <span class="highlighted-text">{{
                        rawRecord.repeatable
                      }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="16">
                    <a-form-item label="Frequency" label-col-flex="110px">
                      <span class="highlighted-text">{{
                        rawRecord.fault_frequency
                      }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="7" :offset="1">
                    <a-form-item label="Module relevant" label-col-flex="110px">
                      <span class="highlighted-text">{{
                        rawRecord.module_relevant
                      }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="7">
                    <a-form-item label="Function" label-col-flex="110px">
                      <span class="highlighted-text">{{
                        rawRecord.functionality
                      }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-divider
                  :size="2"
                  :margin="1"
                  type="solid"
                  orientation="left"
                >
                  Problemmanagement</a-divider
                >
                <div style="margin-top: 50px"></div>
                <a-row :gutter="16">
                  <!-- <a-col :span="7" :offset="1">
                <a-form-item label="SOP date" label-col-flex="70px">
                </a-form-item>
              </a-col> -->
                  <a-col :span="7" :offset="1">
                    <a-form-item label="Estimated date" label-col-flex="100px">
                      <span class="highlighted-text">{{
                        rawRecord.implementation_date
                      }}</span>
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item
                      field="launch"
                      label="Launch"
                      label-col-flex="110px"
                    >
                      <a-select
                        v-model="rawRecord.launch"
                        :style="{ width: '120px' }"
                        disabled
                      >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!-- <a-col :span="12">
                <a-form-item label="Prognosis Date" label-col-flex="100px">
                  <span class="highlighted-text">CW</span>
                </a-form-item>
              </a-col>
              <a-col :span="7" :offset="1">
                <a-form-item label="Requirement-ID" label-col-flex="110px">
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Testauftrags-ID" label-col-flex="110px">
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Testcase-ID" label-col-flex="110px">
                </a-form-item>
              </a-col> -->
                </a-row>
              </a-form>

              <a-divider :size="2" :margin="1" type="solid" orientation="left"
                >Descriptions</a-divider
              >
              <div style="margin-top: 50px"></div>
              <a-row :gutter="16">
                <a-col :span="11" :offset="1">
                  <span class="span-spacing text-right-align">Reclamation</span>
                  <a-textarea
                    :auto-size="{
                      minRows: 10,
                      maxRows: 10,
                    }"
                    style="margin-top: 36px"
                    :model-value="
                      formatProblemDescription(rawRecord.problem_description)
                    "
                  >
                  </a-textarea>
                </a-col>
                <a-col :span="12">
                  <a-tabs type="card-gutter">
                    <a-tab-pane key="1" title="Analysis">
                      <a-textarea
                        :auto-size="{
                          minRows: 10,
                          maxRows: 10,
                        }"
                        disabled
                        :model-value="rawRecord.analysis"
                      >
                      </a-textarea>
                    </a-tab-pane>
                    <a-tab-pane key="2" title="fix/verification">
                      <a-textarea
                        :auto-size="{
                          minRows: 10,
                          maxRows: 10,
                        }"
                        disabled
                        :model-value="rawRecord.verification"
                      >
                      </a-textarea>
                    </a-tab-pane>
                  </a-tabs>
                </a-col>
              </a-row>
              <div style="margin-top: 30px"></div>
              <a-divider :size="2" :margin="1" type="solid" orientation="left"
                >Vehicle</a-divider
              >
              <div style="margin-top: 50px"></div>
              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Veh.no." label-col-flex="110px">
                    <span class="highlighted-text">{{ rawRecord.veh_no }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="TEVBV" label-col-flex="110px">
                    <span class="highlighted-text">{{ rawRecord.vbv }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="Part Number" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.part_no_causing
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="group-project" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.project
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="Section" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.sw_causing
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="Device type" label-col-flex="110px">
                    <span class="highlighted-text"
                      >{{ rawRecord.device_type_2 }}
                    </span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Source" label-col-flex="110px">
                    <span class="highlighted-text">{{ rawRecord.origin }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="HW" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.hw_causing
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="SW" label-col-flex="110px">
                    <span class="highlighted-text"
                      >{{ rawRecord.sw_causing }}
                    </span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-divider :size="2" :margin="1" type="solid" orientation="left"
                >Addressing</a-divider
              >
              <div style="margin-top: 50px"></div>
              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Creator" label-col-flex="110px">
                    <span class="highlighted-text"
                      >{{ rawRecord.creator }}
                    </span>
                  </a-form-item>
                </a-col>

                <a-col :span="16">
                  <a-form-item label-col-flex="50px">
                    <span class="highlighted-text"
                      >{{ rawRecord.typist_user }}
                    </span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Coordinator" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.coordinator
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item label-col-flex="50px">
                    <span class="highlighted-text">{{
                      rawRecord.coordinator_user
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Engineering Co.." label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.spclst_coord
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item label-col-flex="50px">
                    <span class="highlighted-text">{{
                      rawRecord.specialist_coordinator_user
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Problem solver" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.responsible_problem_solver
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item label-col-flex="50px">
                    <span class="highlighted-text">{{
                      rawRecord.responsible_problem_solver_user
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="(Syst.-)Supplier" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.supplier
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item label-col-flex="50px">
                    <span class="highlighted-text">{{
                      rawRecord.supplier_info
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="9" :offset="1">
                  <a-form-item
                    label="Verification Tester"
                    label-col-flex="120px"
                  >
                    <span class="highlighted-text">{{ rawRecord.tester }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="14">
                  <a-form-item label-col-flex="50px">
                    <span class="highlighted-text">{{
                      rawRecord.tester_user
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-divider :size="2" :margin="1" type="solid" orientation="left"
                >Analysis</a-divider
              >
              <div style="margin-top: 50px"></div>
              <a-row :gutter="16">
                <a-col :span="7" :offset="1">
                  <a-form-item label="Last editor" label-col-flex="110px">
                    <span class="highlighted-text">{{
                      rawRecord.responsible_problem_solver
                    }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item>
                    <span class="highlighted-text">{{
                      rawRecord.responsible_problem_solver_user
                    }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #title> <icon-computer />Data Analysis </template>
              <a-divider
                :size="2"
                style="margin-top: 25px; margin-bottom: 25px"
                type="solid"
                orientation="left"
                >Ticket Ping-pong Frequency</a-divider
              >
              <PingPongTicket :item="rawRecord" />
              <a-divider
                :size="2"
                style="margin-top: 25px; margin-bottom: 25px"
                type="solid"
                orientation="left"
                >Ticket Supplier Analyze</a-divider
              >
              <SupplierAnalyzeTicket :item="rawRecord" />

              <a-divider
                :size="2"
                style="margin-top: 25px; margin-bottom: 25px"
                type="solid"
                orientation="left"
                >Ticket VNOK Frequency</a-divider
              >
              <VnokFreqTicket :item="rawRecord" />

              <!-- <a-divider
                :size="2"
                style="margin-top: 15px; margin-bottom: 15px"
                type="solid"
                orientation="left"
                >Data Status Change</a-divider
              >
              <div class="steps-wrapper">
                <a-row align="center">
                  <a-col :span="4" :offset="20">
                    <a-select
                      v-model="fieldStatusChange"
                      :options="fieldTypeOptions"
                      @change="handleFieldChange"
                    />
                  </a-col>
                </a-row>
                <a-steps type="dot">

                  <a-step
                    v-for="(step, index) in steps"
                    :key="index"
                    :title="$t(step.change_field)"
                    :description="formatTimestamp(step.change_time)"
                  />
                </a-steps>
              </div> -->
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { queryTicketStatusChange } from '@/api/list';
  import { useI18n } from 'vue-i18n';
  import useChartOption from '@/hooks/chart-option';
  import SupplierAnalyzeTicket from './supplier-analyze-ticket.vue';
  import PingPongTicket from './ping-pong-ticket.vue';
  import VnokFreqTicket from './vnok-freq-ticket.vue';

  const props = defineProps({
    item: {
      type: Object,
    },
    ticketChangeItem: {
      type: Array as any,
    },
  });

  const emits = defineEmits(['backDetail']);
  const { t } = useI18n();
  const itemData = ref([] as any);
  const ticketNumber = ref(0);
  const rawRecord = ref({} as any);
  const steps = ref({} as any);
  const fieldStatusChange = ref('rating');

  const fieldTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.fieldChange.rating'),
      value: 'rating',
    },
    {
      label: t('searchTable.fieldChange.supplier'),
      value: 'supplier',
    },

    {
      label: t('searchTable.fieldChange.origin'),
      value: 'origin',
    },
    {
      label: t('searchTable.fieldChange.project'),
      value: 'project',
    },

    {
      label: t('searchTable.fieldChange.e_project'),
      value: 'e_project',
    },
  ]);

  const formatTimestamp = (timestamp: string) => {
    if (timestamp.includes('.')) {
      return timestamp.split('.')[0];
    }
    return timestamp;
  };

  const formatProblemDescription = (description?: string): string => {
    if (!description) {
      return '';
    }
    return description.replace(/<NEW_LINE>/g, '\n');
  };

  const goBack = () => {
    emits('backDetail');
  };

  const handleFieldChange = async () => {
    const record = props.item as any;
    const { data } = await queryTicketStatusChange(
      record.cluster_type,
      record.number,
      fieldStatusChange.value
    );
    steps.value = data.list;
  };

  onMounted(() => {
    rawRecord.value = props.item;
    ticketNumber.value = props.item?.number;
    // console.log('rawRecord', rawRecord.value);

    const desRecord: { label: string; value: any }[] = [];
    Object.keys(rawRecord.value).forEach((key) => {
      desRecord.push({ label: key, value: rawRecord.value[key] });
    });
    itemData.value = desRecord;
    handleFieldChange();
  });
</script>

<style scoped>
  .status-container {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    height: 105px;
    text-align: center;
    margin-bottom: 5px;
    justify-content: center;
    padding-top: 15px;
    padding-left: 15px;

    background: #80b0c8;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #70a3bb),
      color-stop(100%, #004666)
    );
    color: #001e2b;
  }

  .status-container1 {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    height: 105px;
    text-align: center;
    margin-bottom: 5px;
    padding-top: 90px;
    padding-left: 15px;
    justify-content: center; /* 水平居中 */
    background: #80b0c8;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #70a3bb),
      color-stop(100%, #004666)
    );
    color: #001e2b;
  }

  .status-icon {
    display: flex;
    align-items: center;
    flex: 1;
    margin: 0 10px;
    margin-left: 25px;
  }

  .status-icon:last-child {
    margin-right: 0;
  }

  .status-icon .status-number {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6); /* 透明白色 */
    border: 2px solid #00a2ff;
    color: #00a2ff;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    width: 60px; /* 增加了圆圈的大小 */
    height: 60px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .header-info {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: white;
    padding: 5px 5px;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #70a3bb),
      color-stop(100%, #004666)
    );
  }
  .status-text {
    font-size: 14px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    max-width: 176px;
    font-weight: bold;
    white-space: nowrap;
    color: white;
  }

  .row-spacing {
    margin-bottom: 10px;
  }

  .span-spacing {
    margin-right: 20px;
  }

  .text-right-align {
    text-align: right;
  }
  .back-button {
    color: white;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #70a3bb),
      color-stop(100%, #004666)
    );
  }

  .steps-wrapper {
    width: 100%;
    min-width: fit-content;
    margin-bottom: 150px;
    padding: 20px;
    background-color: rgb(var(--gray-1));
  }

  .highlighted-text {
    font-weight: 550;
    font-size: 14px;
    font-family: Verdana, sans-serif;
  }
  .arco-timeline-item-dot-wrapper {
    height: 800px;
  }
  .vertical-align-middle {
    display: flex;
    align-items: center; /* 使文本垂直居中 */
    height: 100%; /* 确保占满父容器的高度 */
  }
</style>
