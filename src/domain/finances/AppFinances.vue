<template>
  <div class="flex p-4 bg-white h-full">
    <div class="w-full">
      <div class="flex justify-between">
        <div class="grid grid-cols-3 gap-4">
          <input type="text" placeholder="Search" class="form-element p-2 border rounded shadow-sm" />
          <select class="form-element p-2 border rounded shadow-sm">
            <option disabled value="">--Select Status--</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
          <select class="form-element p-2 border rounded shadow-sm">
            <option value="">Sort</option>
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
        <div class="flex gap-2">
          <input type="date" class="form-element p-2 border rounded shadow-sm" />
          <span class="text-center mx-2">-</span>
          <input type="date" class="form-element p-2 border rounded shadow-sm" />
        </div>
      </div>

      <table class="w-full mt-4 border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 p-2">#</th>
            <th class="border border-gray-300 p-2">Tracking Number</th>
            <th class="border border-gray-300 p-2">PRN</th>
            <th class="border border-gray-300 p-2">Service</th>
            <th class="border border-gray-300 p-2">Amount (UGX)</th>
            <th class="border border-gray-300 p-2">Status</th>
            <th class="border border-gray-300 p-2">Date</th>
            <th class="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in transactions" :key="index">
            <td class="border border-gray-300 p-2 text-center">{{ index + 1 }}</td>
            <td class="border border-gray-300 p-2 text-blue-600 hover:underline">
              {{ item.trackingNumber }} <i class="fa-regular fa-copy ml-1"></i>
            </td>
            <td class="border border-gray-300 p-2 text-gray-600 italic">{{ item.prn }}</td>
            <td class="border border-gray-300 p-2">{{ item.service }}</td>
            <td class="border border-gray-300 p-2 text-blue-500">{{ item.amount.toLocaleString() }}</td>
            <td :class="getStatusClass(item.status)">{{ item.status }}</td>
            <td class="border border-gray-300 p-2">{{ item.date }}</td>
            <td class="border border-gray-300 p-2">
              <button class="action-btn p-2 bg-blue-500 text-white rounded">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Transaction {
  trackingNumber: string
  prn: string
  service: string
  amount: number
  status: string
  date: string
}

const transactions = ref<Transaction[]>([
  { trackingNumber: 'M241128-0002', prn: '2250000039829', service: 'SPECIAL LICENSE', amount: 50000, status: 'SUCCESS', date: '2024-11-28 10:17:00' },
  { trackingNumber: 'M241127-0008', prn: '2250000039915', service: 'MARRIAGE', amount: 50000, status: 'SUCCESS', date: '2024-11-28 10:09:00' },
  { trackingNumber: 'M241127-0016', prn: '2250000040081', service: 'MARRIAGE RETURNS', amount: 2000000, status: 'SUCCESS', date: '2024-11-27 16:20:00' },
  // Add more dummy data as needed
])

function getStatusClass(status: string) {
  return status === 'SUCCESS'
    ? 'text-green-600 bg-green-50 p-1 rounded'
    : status === 'FAILED'
    ? 'text-red-600 bg-red-50 p-1 rounded'
    : 'text-yellow-600 bg-yellow-50 p-1 rounded'
}
</script>

<style scoped>
.action-btn {
  @apply p-2 text-sm bg-blue-500 text-white rounded shadow hover:bg-blue-600;
}
.form-element {
  @apply w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
