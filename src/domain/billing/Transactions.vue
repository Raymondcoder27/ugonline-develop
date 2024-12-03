<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useAccounts } from "@/domain/accounts/stores";
import { onMounted, type Ref, ref, watch, reactive } from "vue";
import CreateAccount from "@/domain/accounts/components/CreateAccount.vue";
import moment from "moment";
import type { IGoFilter } from "@/types"
import { useDebounceFn } from "@vueuse/core"
import type { IResendVerificationPayload, TAccountVerificationType } from "./types"

const store = useAccounts();
const modalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);
// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page:0,
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
})

onMounted(() => {
  fetch()
})

function fetch() {
  filter.limit = limit.value
  filter.page = page.value
  store.fetchBackofficeAccounts(filter)
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
})
const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return
  reVerifyForm.purpose = purpose
  reVerifyForm.username = username
  store.resendAccountVerification(reVerifyForm)
}

const updateFilter = useDebounceFn(
  () => {
    fetch()
  },
  300,
  { maxWait: 5000 }
)

function convertDate(date: string) {
  return moment(date).format("DD-MM-YYYY")
}

function next(){
  page.value += 1
  fetch()
}

function previous(){
  page.value -= 1
  fetch()
}

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      fetch()
    }
  },
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
)
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow"></div><!-- <div class="flex-grow">
        <div class="grid grid-cols-5 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3">
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
            class="filter-element e-input" type="text" placeholder="Search by Name" />
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[1].operand"
            class="filter-element e-input" type="text" placeholder="Email Address" />
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input" type="text" placeholder="Phone Number" />
          <button @click="modalOpen = true" class="button btn-sm my-auto" type="button">
            <i class="px-1 fa-solid fa-plus"></i> Add Account
          </button>
        </div>
      </div> -->
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr>
            <th>Branch Name</th>
            <th>Manager</th>
            <th>Transaction Type</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, idx) in billingStore.transactions"
            :key="idx"
            :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
          >
            <td>{{ transaction.branchName }}</td>
            <td>{{ transaction.manager }}</td>
            <td class="text-center">{{ transaction.transactionType }}</td>
            <td class="text-center">{{ transaction.status }}</td>
            <td class="text-center">{{ convertDate(transaction.date) }}</td>
            <td class="text-center">
              <button @click="openTransaction(transaction)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.backofficeAccounts?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.backofficeAccounts?.length - 1 || limit > store.backofficeAccounts?.length" class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <CreateAccount @cancel="close" />
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
