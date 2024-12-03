<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import AppModal from "@/components/AppModal.vue";
import { useBilling } from "@/domain/billing/stores";
import { useDebounceFn } from "@vueuse/core";
import moment from "moment";
import type { IGoFilter } from "@/types";

const billingStore = useBilling();

// State
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Filter setup for transactions
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "date", // Sorting by date for transactions
      order: "ASC",
    },
  ],
  filter: [
    { field: "branchName", operand: "", operator: "CONTAINS" },
    { field: "manager", operand: "", operator: "CONTAINS" },
    { field: "status", operand: "", operator: "CONTAINS" },
  ],
});

// Fetch transactions
const fetch = () => {
  filter.limit = limit.value;
  filter.page = page.value;
  billingStore.fetchTransactions(filter);
};

// Debounced filter update
const updateFilter = useDebounceFn(() => fetch(), 300, { maxWait: 5000 });

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

// Modal control
const openTransaction = (transaction: any) => {
  // Logic to open modal with transaction details
  modalOpen.value = true;
};

const close = () => {
  modalOpen.value = false;
};

// Watchers
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) fetch(); // Re-fetch transactions when modal closes
  }
);

watch(() => filter, updateFilter, { deep: true });

// Initialize fetch on mounted
onMounted(() => fetch());
</script>


<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow"></div>
      <!-- <div class="flex-grow">
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
          <tr class="text-left">
            <th>#</th>
            <th>Branch Name</th>
            <th>Manager</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="text-left"
            v-for="(transaction, idx) in billingStore.transactions"
            :key="idx"
            :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
          >
            <td>{{ idx + 1 }}</td>
            <td>{{ transaction.branchName }}</td>
            <td>{{ transaction.manager }}</td>
            <td class="text-left">{{ transaction.transactionType }}</td>
            <td class="text-left">{{ transaction.amount }}</td>
            <td class="text-left">{{ transaction.status }}</td>
            <td class="text-left">{{ convertDate(transaction.date) }}</td>
            <!-- <td class="text-left"> -->
            <!-- <button @click="openTransaction(transaction)">Edit</button> -->
            <!-- actions -->

            <!-- </td> -->

            <td class="text-left">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(transaction)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(transaction)"
              ></i>
              <!-- <i
    class="fa-solid fa-sliders p-1 mx-1 text-primary-700 bg-primary-100 border border-primary-300 hover:text-primary-900"
    @click="configure(branch)"
  ></i> -->

              <!-- delete branch -->
              <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(transaction)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="flex">
      <button v-if="page > 1" @click="previousPage">Previous</button>
      <span>{{ page }}</span>
      <button v-if="billingStore.transactions.length === limit" @click="nextPage">Next</button>
    </div> -->
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
