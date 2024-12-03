<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useAccounts } from "@/domain/accounts/stores";
import { onMounted, ref, reactive, watch } from "vue";
import CreateAccount from "@/domain/accounts/components/CreateAccount.vue";
import moment from "moment";
import { useDebounceFn } from "@vueuse/core";
import type { IGoFilter } from "@/types";
import type { IResendVerificationPayload, TAccountVerificationType } from "./types";

// Store
const store = useAccounts();

// State
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Filter setup
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
    { field: "firstname", operand: "", operator: "CONTAINS" },
    { field: "username", operand: "", operator: "CONTAINS" },
    { field: "phone", operand: "", operator: "CONTAINS" }
  ]
});

// Fetch accounts
const fetch = () => {
  filter.limit = limit.value;
  filter.page = page.value;
  store.fetchBackofficeAccounts(filter);
};

// Debounced filter update
const updateFilter = useDebounceFn(() => fetch(), 300, { maxWait: 5000 });

// Form for re-verification
const reVerifyForm: IResendVerificationPayload = reactive({
  purpose: "",
  username: ""
});

// Resend verification request
const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return;
  reVerifyForm.purpose = purpose;
  reVerifyForm.username = username;
  store.resendAccountVerification(reVerifyForm);
};

// Date conversion utility
const convertDate = (date: string) => moment(date).format("DD-MM-YYYY");

// Pagination
const next = () => {
  page.value += 1;
  fetch();
};

const previous = () => {
  page.value -= 1;
  fetch();
};

// Watchers
watch(() => modalOpen.value, (isOpen) => {
  if (!isOpen) fetch();
});

watch(() => filter, updateFilter, { deep: true });

// Initialize fetch
onMounted(() => fetch());
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
      <button v-if="page > 1" @click="previousPage">Previous</button>
      <span>{{ page }}</span>
      <button v-if="billingStore.transactions.length === limit" @click="nextPage">Next</button>
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
