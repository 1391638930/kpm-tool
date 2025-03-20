<template>
  <el-card
    v-if="isTicketObject(ticket)"
    class="ticketItem"
    @click="viewDetail(ticket)"
  >
    <template #header>
      <div class="ticketTitle">
        <div>
          <span>
            {{ ticket.number }}
          </span>
          <div class="ticketFieldStatus">
            {{ ticket.status }}
          </div>
          <div class="ticketFieldStatus">
            {{ ticket.engineering_status }}
          </div>
          <div class="ticketFieldStatus">
            {{ ticket.l_status }}
          </div>
        </div>
        <el-popconfirm
          title="Are you sure to delete this?"
          @confirm="unsubTicket(ticket)"
          width="240"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          confirm-button-type="danger"
        >
          <template #reference>
            <a-button size="mini" shape="circle" @click.stop>
              <icon-close />
            </a-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
    {{ ticket.short_text }}
    <template #footer>
      <div class="ticketFooter">
        <span>{{ ticket.typist_user }}</span>
        <icon-arrow-fall class="ticketFooterArrow" />
        <span>{{ ticket.responsible_problem_solver_user }}</span>
      </div>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  ticket: {
    type: Object as any,
  },
});

const emits = defineEmits(['unsubTicket', 'viewDetail']);

const viewDetail = (params: any) => {
  emits('viewDetail', params);
};

const isTicketObject = (
  value: any
): value is {
  number: string;
  status: string;
  l_status: string;
  engineering_status: string;
  short_text: string;
  typist_user: string;
  creator: string;
  responsible_problem_solver_user: string;
} => {
  return typeof value === 'object' && value !== null && 'number' in value;
};

const unsubTicket = (params: any) => {
  emits('unsubTicket', params);
};
</script>

<style scoped lang="less">
.ticketItem {
  margin-top: 16px;
}

.ticketItem:nth-child(1) {
  margin-top: 0;
}

.ticketTitle {
  display: flex;
  justify-content: space-between;
}

.ticketTitle > div {
  display: flex;
  align-items: center;
}

.ticketTitle > div > span {
  margin-right: 16px;
  // background-color: #169BD5;
  background-color: #165dff;
  color: #fff;
  padding: 0 8px;
  border-radius: 4px;
}

.ticketFieldStatus {
  display: flex;
  height: 18px;
  width: 18px;
  align-items: center;
  justify-content: center;
  border: 1px solid #898989;
  border-radius: 50%;
  margin-right: 3px;
  font-size: 12px;
}

.ticketFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  letter-spacing: -0.5px;
}

.ticketFooterArrow {
  color: #f59a23;
  transform: rotate(-90deg);
}
</style>
