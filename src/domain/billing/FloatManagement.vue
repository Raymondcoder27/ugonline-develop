<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useBilling } from "@/domain/billing/stores";
import { onMounted, type Ref, ref, reactive, watch } from "vue";
import AssignFloat from "@/domain/billing/components/AssignFloat.vue";
import { useDebounceFn } from "@vueuse/core";
import type { IGoFilter } from "@/types";
import moment from "moment";
import type { IResendVerificationPayload, TAccountVerificationType } from "./types";

const billingStore = useBilling();

const modalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);

// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC"
    }
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS"
    },
  ]
});

onMounted(() => {
  fetch();
  billingStore.fetchTransactions(); // Fetch transactions when the component mounts
  billingStore.fetchFloatLedgers(); // Fetch float ledgers
});

function fetch() {
  filter.limit = limit.value;
  filter.page = page.value;
  billingStore.fetchBackofficeUsers(filter);
}

function open() {
  modalOpen.value = true;
}

function close() {
  modalOpen.value = false;
}

const reVerifyForm: IResendVerificationPayload = reactive({
  purpose: "",
  username: ""
});

const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return;
  reVerifyForm.purpose = purpose;
  reVerifyForm.username = username;
  billingStore.resendAccountVerification(reVerifyForm);
};

const updateFilter = useDebounceFn(
  () => {
    fetch();
  },
  300,
  { maxWait: 5000 }
);

function convertDate(date: string) {
  return moment(date).format("DD-MM-YYYY");
}

function next() {
  page.value += 1;
  fetch();
}

function previous() {
  page.value -= 1;
  fetch();
}

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      fetch();
    }
  }
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);
</script>

<template>

  <!-- <h2>Transactions</h2>
    <ul>
      <li v-for="transaction in billingStore.transactions" :key="transaction.id">
        {{ transaction.description }} - {{ transaction.amount }}
      </li>
    </ul> -->
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div class="grid grid-cols-5 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3">
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
            class="filter-element e-input" type="text" placeholder="Search by Name" />
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[1].operand"
            class="filter-element e-input" type="text" placeholder="Search by Branch" />
          <button @click="modalOpen = true" class="button btn-sm my-auto" type="button">
            <i class="px-1 fa-solid fa-plus"></i> Allocate Float
          </button>
        </div>
      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="t-header" width="30%">Names</th>
            <th class="t-header">Branch</th>
            <th class="t-header">Amount(UGX)</th>
            <th class="text-center">Date Assigned</th>
            <th class="t-header"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(account, idx) in billingStore.backOfficeUsers" :key="account.id">
            <td class="text-left">{{ idx + 1 }}</td>
            <td>
              <label class="font-bold py-1">
                {{ account.fullName }} 
                <!-- {{ account.lastName }} -->
                <!-- {{ account.middleNames }} -->
                  Name goes here
              </label>
              <i class="fa-solid fa-exclamation-triangle" v-if="account.blockedAt"></i>
            </td>
            <td>
              <label class="font-bold py-1">
                {{ account.branch }} 
                <!-- {{ account.lastName }} -->
                <!-- {{ account.middleNames }} -->
              </label>
              <i class="fa-solid fa-exclamation-triangle" v-if="account.blockedAt"></i>
            </td>
            <td>
              <label class="font-bold py-1">
                {{ account.dateAssigned }} 
                <!-- {{ account.lastName }} -->
                <!-- {{ account.middleNames }} -->
              </label>
              <i class="fa-solid fa-exclamation-triangle" v-if="account.blockedAt"></i>
            </td>
           
            <!-- <td class="text-center">
              <label v-if="account.blockedAt" class="text-red-600 font-bold">BLOCKED</label>
              <label v-else class="text-green-600 font-bold">ACTIVE</label>
            </td>
            <td class="text-center">
              <i v-if="account.activatedAt" class="fa-solid fa-check-square text-green-600"></i>
              <i v-else class="fa-solid fa-times-square text-red-600"></i>
            </td>
            <td class="text-center">{{ convertDate(account.createdAt) }}</td>
            <td class="text-center">
              <div class="flex flex-row space-x-2 w-full justify-center" v-if="!account.blockedAt">
                <i class="text-gray-600 fa-solid fa-pencil px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i>
                <i class="text-gray-600 fa-solid fa-reply px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i>
                <i v-if="account.phoneVerified && !account.activatedAt"
                  class="text-gray-600 fa-solid fa-unlock-keyhole px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="resend('change-password', account.username)" title="Change Password"></i>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == billingStore.backOfficeUsers?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == billingStore.backOfficeUsers?.length - 1 || limit > billingStore.backOfficeUsers?.length" class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <AssignFloat @cancel="close" />
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
