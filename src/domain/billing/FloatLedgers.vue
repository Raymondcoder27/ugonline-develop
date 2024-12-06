<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch, computed } from "vue";
import { useBilling } from "@/domain/billing/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import type {
  Transaction,
  FloatLedger,
  FloatRequest,
  FloatManagement,
} from "./types"; // Import billing types
import moment from "moment/moment";
import { useBalance } from "@/domain/balance/stores"; // Import the balance store

const balanceStore = useBalance(); // Initialize the balance store

balanceStore.fetchTotalBalance(); // Decrease balance by 100

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
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "description",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "amount",
      operand: "",
      operator: "GREATER_THAN",
    },
    {
      field: "balance",
      operand: "",
      operator: "GREATER_THAN",
    },
  ],
  fromDate: "", // Add fromDate
  toDate: "", // Add toDate
});

// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchTransactions();
  store.fetchFloatLedgers(); // Fetch float ledgers
  // balanceStore.fetchTotalBalance(); // Fetch total balance
  // balanceStore.increaseTotalBalance(); // Increase balance by 100
});

// Dynamically compute the balances for each transaction
// const computedTransactions = computed(() => {
//   let runningBalance = balanceStore.totalBalance.current; // Start with the current total balance
//   return store.floatLedgers
//     .slice() // Create a shallow copy to avoid mutation
//     .reverse() // Reverse to calculate balances in chronological order
//     .map((transaction) => {
//       runningBalance -= transaction.amount; // Adjust balance for each transaction
//       return {
//         ...transaction,
//         balance: runningBalance, // Attach the computed balance to each transaction
//       };
//     })
//     .reverse(); // Reverse back to preserve the original order
// });


const computedTransactions = computed(() => {
  // Ensure we have a valid starting balance and transactions
  if (!balanceStore.totalBalance.current || store.floatLedgers.length === 0) {
    return [];
  }

  // Initialize the running balance from the total balance
  let runningBalance = balanceStore.totalBalance.current;

  // Process the transactions in reverse order to calculate balances
  const transactionsWithBalances = store.floatLedgers
    .slice() // Create a shallow copy to avoid mutation
    .reverse() // Reverse to process from the most recent transaction
    .map((transaction) => {
      // Attach the current running balance to the transaction
      const transactionBalance = runningBalance;
      // Adjust the running balance by subtracting the transaction amount
      runningBalance -= transaction.amount;

      return {
        ...transaction,
        balance: transactionBalance,
      };
    })
    .reverse(); // Reverse back to preserve chronological order

  return transactionsWithBalances;
});


function fetchTransactions() {
  filter.limit = limit.value;
  filter.page = page.value;

  // Add date filter if both dates are provided
  if (filter.fromDate && filter.toDate) {
    filter.filter.push({
      field: "date",
      operator: "BETWEEN",
      operand: [filter.fromDate, filter.toDate],
    });
  }

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

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Debounced filter update function
const updateFilter = useDebounceFn(
  () => {
    fetchTransactions();
  },
  300,
  { maxWait: 5000 }
);

// Watch for changes in the modal state
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) {
      // Handle modal close if needed
    }
  }
);

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

watch(
  () => balanceStore.totalBalance,
  (newVal) => {
    console.log("Balance updated:", newVal);
  },
  { deep: true }
);

watch(
  () => store.floatLedgers,
  (newLedgers) => {
    console.log("Float ledgers updated:", newLedgers);
  }
);

watch(
  computedTransactions,
  (transactions) => {
    console.log("Computed transactions:", transactions);
  },
  { deep: true }
);
</script>


<template>
  <div class="">
    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white">
      <!-- <div class="flex items-center justify-end border-b pb-4 mb-4 mt-3">
        <div>
          <label for="date-range" class="mr-2 text-sm text-gray-600 justify-end">Date Range:</label>
          <input
            type="date"
            id="date-range"
            class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div> -->
      <div class="flex items-center justify-end border-b pb-4 mb-4 mt-3">
        <div class="flex space-x-4">
          <div>
            <label for="date-from" class="mr-2 text-sm text-gray-600"
              >From:</label
            >
            <input
              type="date"
              id="date-from"
              class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="filter.fromDate"
            />
          </div>
          <div>
            <label for="date-to" class="mr-2 text-sm text-gray-600">To:</label>
            <input
              type="date"
              id="date-to"
              class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="filter.toDate"
            />
          </div>
        </div>
      </div>

      <!-- Table -->
      <!-- Table -->
      <div class="flex my-1">
        <table class="table w-full">
          <thead>
            <tr class="header-tr">
              <!-- <th class="t-header">#</th> -->
              <th class="t-header">Date</th>
              <th class="t-header">Description</th>
              <th class="text-right t-header">Amount</th>
              <th class="text-right t-header">Balance</th>
            </tr>
          </thead>
          <thead v-if="loading">
            <tr>
              <th colspan="12" style="padding: 0">
                <div
                  class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"
                ></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr
              v-for="(transaction) in store.floatLedgers"
              :key="transaction.id"
              class="body-tr"
            > -->
            <tr
              v-for="(transaction) in computedTransactions"
              :key="transaction.id"
              class="body-tr"
            >
              <!-- <td class="text-left">{{ idx + 1 }}</td> -->
              <td class="text-left">
                <span class="text-xs">{{
                  convertDateTime(transaction.createdAt)
                }}</span>
              </td>
              <td class="text-left">
                <label class="cursor-pointer hover:text-primary-700 mx-2">
                  <span class="hover:underline">{{
                    transaction.description
                  }}</span>
                </label>
              </td>

              <!-- <td>
                <span
                class="text-left bg-blue-200 text-blue-600 rounded-sm font-semibold px-2 py-1"
                :class="{ 'bg-red-300 text-red-600  rounded-md px-2': transaction.amount < 0 }">{{ transaction.description }}</span>
              </td> -->
              <!-- <td class="text-left text-green-600">
                <span>{{ transaction.amount }}</span>
              </td> -->
              <!-- v-bind for red incase negative transaction and green incase positive transaction -->
              <td
                class="text-left text-green-600"
                :class="{ 'text-red-600': transaction.amount < 0 }"
              >
                <span>{{ transaction.amount }}</span>
              </td>
              <td class="text-left text-gray-800">
                <span>{{ transaction.balance }}</span>
              </td>
            </tr>
          </tbody>
          <!-- <tfoot>
            <tr class="bg-gray-50">
              <td colspan="3" class="text-left font-bold text-gray-600">
                Totals:
              </td>
              <td class="text-left font-bold text-gray-800">
                {{ store.totalAmount }}
              </td>
              <td class="text-left font-bold text-gray-800">
                {{ store.totalBalance }}
              </td>
            </tr>
          </tfoot> -->
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
