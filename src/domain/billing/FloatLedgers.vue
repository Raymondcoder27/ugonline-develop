<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch } from "vue";
import { useBilling } from "@/domain/billing/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import type { Transaction, FloatLedger, FloatRequest, FloatManagement } from "./types"; // Import billing types

const store = useBilling(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Billing-specific filter
const filter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "date",
      order: "ASC"
    }
  ],
  filter: [
    {
      field: "description",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "amount",
      operand: "",
      operator: "GREATER_THAN"
    },
    {
      field: "balance",
      operand: "",
      operator: "GREATER_THAN"
    },
  ]
});

// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchTransactions();
});

function fetchTransactions() {
  filter.limit = limit.value;
  filter.page = page.value;
  store.fetchTransactions(filter); // Fetch transactions based on filter
}

function next() {
  page.value += 1;
  fetchTransactions();
}

function previous() {
  page.value -= 1;
  fetchTransactions();
}

function open() {
  modalOpen.value = true;
}

function close() {
  modalOpen.value = false;
}

// Debounced filter update function
const updateFilter = useDebounceFn(() => {
  fetchTransactions();
}, 300, { maxWait: 5000 });

// Watch for changes in the modal state
watch(() => modalOpen.value, (isOpen) => {
  if (!isOpen) {
    // Handle modal close if needed
  }
});

// Watch for changes in the filter object
watch(() => filter, () => updateFilter(), { deep: true });
</script>

<template>
  <div class="">

    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white">
      <div class="flex items-center justify-between border-b pb-4 mb-4 mt-3">
        <div>
          <label for="date-range" class="mr-2 text-sm text-gray-600">Date Range:</label>
          <input
            type="date"
            id="date-range"
            class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto  p-2">
        <table class="w-full border-collapse border text-left">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-200 px-4 py-2 text-gray-600">Date</th>
              <th class="border border-gray-200 px-4 py-2 text-gray-600">Description</th>
              <th class="border border-gray-200 px-4 py-2 text-gray-600 text-right">Amount</th>
              <th class="border border-gray-200 px-4 py-2 text-gray-600 text-right">Balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(transaction, idx) in store.transactions" :key="transaction.id">
              <td class="px-4 py-2">{{ transaction.date }}</td>
              <td class="px-4 py-2">{{ transaction.description }}</td>
              <td class="px-4 py-2 text-right text-green-600">{{ transaction.amount }}</td>
              <td class="px-4 py-2 text-right text-gray-800">{{ transaction.balance }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td colspan="2" class="px-4 py-2 text-right font-bold text-gray-600">Totals:</td>
              <td class="px-4 py-2 text-right font-bold text-gray-800">{{ store.totalAmount }}</td>
              <td class="px-4 py-2 text-right font-bold text-gray-800">{{ store.totalBalance }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="modalOpen" xl2>
      <!-- Your modal content goes here -->
    </AppModal>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
