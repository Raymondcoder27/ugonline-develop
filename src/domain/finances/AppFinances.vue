<template>
  <div class="w-full shadow-lg bg-white rounded p-4">
    <div class="flex justify-between items-center py-2">
      <div class="text-primary-700 flex items-center">
        <i class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-list"></i>
        <label class="text-lg mx-2">Transactions</label>
      </div>
      <!-- Add Transaction button -->
      <button class="button btn-sm" @click="openAddTransactionModal">
        <i class="fa-solid fa-plus-circle"></i> Add Transaction
      </button>
    </div>

    <div class="flex justify-between mb-4">
      <div class="grid grid-cols-4 gap-2 w-3/4">
        <input class="filter-element e-input" type="text" placeholder="Search by Tracking Number" v-model="filters.search" />
        <select class="filter-element e-select" v-model="filters.status">
          <option value="">- Select Status -</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
        <input type="date" class="filter-element e-input" v-model="filters.startDate" />
        <input type="date" class="filter-element e-input" v-model="filters.endDate" />
      </div>
      <div>
        <button class="button btn-sm" @click="clearFilters">
          <i class="fa-solid fa-filter-circle-xmark"></i> Clear Filters
        </button>
      </div>
    </div>

    <div>
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Tracking Number</th>
            <th class="t-header">PRN</th>
            <th class="t-header">Service</th>
            <th class="t-header text-right">Amount (UGX)</th>
            <th class="t-header text-center">Status</th>
            <th class="t-header">Date</th>
            <th class="t-header">Actions</th>
          </tr>
        </thead>
        <thead v-if="loading">
          <tr>
            <th colspan="8" style="padding: 0">
              <div class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in filteredTransactions" :key="transaction.id" class="body-tr">
            <td>{{ index + 1 }}.</td>
            <td>
              <span class="hover:underline text-blue-600 cursor-pointer">{{ transaction.trackingNumber }}</span>
            </td>
            <td>{{ transaction.prn }}</td>
            <td>{{ transaction.service }}</td>
            <td class="text-right">{{ formatAmount(transaction.amount) }}</td>
            <td :class="statusClass(transaction.status)" class="text-center">
              {{ transaction.status }}
            </td>
            <td>{{ convertDateTime(transaction.date) }}</td>
            <td class="text-center">
              <i class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700" @click="viewDetails(transaction)"></i>
              <i class="fa-solid fa-copy p-1 mx-1 text-gray-600 bg-gray-50 border border-gray-200 hover:text-primary-700" @click="copy(transaction.trackingNumber)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="flex justify-between items-center mt-4">
      <button class="pagination-button" @click="previous" :disabled="page === 1">
        <i class="fa-solid fa-arrow-left"></i> Previous
      </button>
      <label class="text-white bg-primary-700 px-3 py-1 rounded">{{ page }}</label>
      <button class="pagination-button" @click="next" :disabled="filteredTransactions.length < limit">
        Next <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import moment from 'moment';

interface Transaction {
  id: number;
  trackingNumber: string;
  prn: string;
  service: string;
  amount: number;
  status: string;
  date: string;
}

const transactions = ref<Transaction[]>([
  { id: 1, trackingNumber: 'M241128-0002', prn: '2250000039829', service: 'SPECIAL LICENSE', amount: 50000, status: 'SUCCESS', date: '2024-11-28T10:17:00' },
  { id: 2, trackingNumber: 'M241127-0008', prn: '2250000039915', service: 'MARRIAGE', amount: 50000, status: 'FAILED', date: '2024-11-28T10:09:00' },
  { id: 3, trackingNumber: 'M241126-0005', prn: '2250000039921', service: 'LICENSE RENEWAL', amount: 100000, status: 'PENDING', date: '2024-11-27T14:25:00' }
]);

const filters = ref({ search: '', status: '', startDate: '', endDate: '' });
const loading = ref(false);
const page = ref(1);
const limit = 10;

function statusClass(status: string) {
  return status === 'SUCCESS'
    ? 'text-green-600 bg-green-50 p-1 rounded'
    : status === 'FAILED'
    ? 'text-red-600 bg-red-50 p-1 rounded'
    : 'text-yellow-600 bg-yellow-50 p-1 rounded';
}

function filteredTransactions() {
  return transactions.value.filter((t) => {
    return (
      (!filters.value.search || t.trackingNumber.includes(filters.value.search)) &&
      (!filters.value.status || t.status === filters.value.status) &&
      (!filters.value.startDate || moment(t.date).isSameOrAfter(filters.value.startDate)) &&
      (!filters.value.endDate || moment(t.date).isSameOrBefore(filters.value.endDate))
    );
  });
}

function clearFilters() {
  filters.value = { search: '', status: '', startDate: '', endDate: '' };
}

function formatAmount(amount: number) {
  return amount.toLocaleString();
}

function convertDateTime(date: string) {
  return moment(date).format('DD-MM-YYYY HH:mm:ss');
}

function previous() {
  if (page.value > 1) page.value--;
}

function next() {
  page.value++;
}

// Add Transaction modal logic
function openAddTransactionModal() {
  console.log('Opening Add Transaction Modal');
}

function viewDetails(transaction: Transaction) {
  console.log('View details:', transaction);
}

function copy(trackingNumber: string) {
  navigator.clipboard.writeText(trackingNumber);
}
</script>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
</style>
