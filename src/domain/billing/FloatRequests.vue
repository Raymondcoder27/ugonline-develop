<script setup lang="ts">
import { useBilling } from "@/domain/billing/stores";
import { onMounted, ref, reactive, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import type { IGoFilter } from "@/types";
import { request } from "http";
// import { useDebounce } from "@vueuse/core";


  

const store = useBilling();
const page = ref(1);
const limit = ref(10);

const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS",
    },
  ],
});



const next = () => {
  if (store.transactions.length >= store.limit) {
    page.value += 1;
    store.fetchTransactions();
  }
};

const previous = () => {
  if (page.value > 1) {
    page.value -= 1;
    store.fetchTransactions();
  }
};

// Debounced filter update function
const updateFilter = useDebounceFn(
  () => {
    fetchTransactions();
  },
  300,
  { maxWait: 5000 }
);

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

// float request approval or rejection
// const activeServices = computed(() => {
//   return store.subscribedServices.filter(
//     (service) => service.status === "subscribed"
//   );
// });

// const approveFloatRequest = (reject: any) => {
//   store.approveFloatRequest(reject);
// };

// const rejectFloatRequest = (approve: any) => {
//   store.rejectFloatRequest(approve);
// };

// pass in the requestId
const approveFloatRequest = (requestId: any) => {
  store.approveFloatRequest(requestId);
};

const rejectFloatRequest = (requestId: any) => {
  store.rejectFloatRequest(requestId);
};




onMounted(() => {
  store.fetchFloatRequests();
});
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
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
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <!-- <th class="text-left">#</th> -->
            <th class="text-left">Date</th>
            <!-- <th class="text-left">Name</th> -->
            <th class="text-left">Branch</th>
            <th class="text-left">Amount</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, idx) in store.floatRequests" :key="idx">
            <!-- <td>{{ idx + 1 }}</td> -->
            <td class="text-left">{{ transaction.date }}</td>
            <!-- <td>
              <label class="font-bold py-1">{{
                transaction.description
              }}</label>
            </td> -->
            <td class="text-left">{{ transaction.branch }}</td>
            <td class="text-left">{{ transaction.amount }}</td>

            <!-- approve or reject and make button either approved or rejected after click using v-if -->
            <!-- <td class="text-black-700">
                  <span
                    :class="{
                      'bg-warning-100 border border-warning-400 text-warning-600 font-semibold rounded-sm px-1 py-0.3':
                        log.requestMethod === 'POST',
                      'bg-blue-50 border border-blue-300 text-blue-400 font-semibold rounded-sm px-1 py-0.3':
                        log.requestMethod === 'GET',
                      'bg-red-100 border border-red-300 text-red-500 font-semibold rounded-sm px-1 py-0.3':
                        log.requestMethod === 'DELETE',
                    }"
                    >{{ log.requestMethod }}</span
                  >
                </td> -->

            <td class="text-black-700">
              <!-- First Case: float request approved -->
              <div v-if="transaction.status === 'approved'">
                <label>
                  <span
                    class="text-xs rounded-md p-1 font-semibold text-green-600 bg-green-100 border border-green-200 hover:text-green-700 hover:bg-green-200"
                    @click="open(transaction)"
                    >Approved</span
                  >
                </label>
              </div>

              <!-- Second Case: Manager directly assigned to branch -->
              <div v-else-if="transaction.status === 'rejected'">
                <label>
                  <span
                    class="text-xs rounded-md p-1 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                    @click="open(transaction)"
                    >Rejected</span
                  >
                </label>
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <div v-else>
                <td class="text-center">
                  <span
                    class="text-xs rounded-md p-1 font-semibold text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700 hover:bg-blue-200"
                    @click="rejectFloatRequest(requestId)"
                    >Approve</span
                  >

                  <span
                    class="text-xs rounded-md p-1 mr-2 ml-3 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                    @click="approveFloatRequest(requestId)"
                    >Reject</span
                  >
                </td>
              </div>
            </td>

            <!-- <td class="text-center">
              <span class="text-xs rounded-md p-1 font-semibold text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700 hover:bg-blue-200"
                @click="open(transaction)">Approve</span>

              <span class="text-xs rounded-md p-1 mr-2 ml-3 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"             
                @click="open(transaction)">Reject</span>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="flex">
      <div class="w-full">
        <div class="flex">
          <button v-if="page > 1" class="pagination-button" @click="previous">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{
              page
            }}</label>
          </div>

          <button
            v-if="store.transactions.length === store.limit"
            class="pagination-button"
            @click="next"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
