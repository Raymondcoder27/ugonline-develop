<script setup lang="ts">
import { useBilling } from "@/domain/billing/stores";
import { onMounted, ref, reactive } from "vue";
import { useDebounceFn } from "@vueuse/core";
import type { IGoFilter } from "@/types";

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

onMounted(() => {
  store.fetchTransactions();
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
            <th class="text-left">#</th>
            <th class="text-left">Name</th>
            <th class="text-left">Branch</th>
            <th class="text-left">Date</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, idx) in store.transactions" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>
              <label class="font-bold py-1">{{
                transaction.description
              }}</label>
            </td>
            <td class="text-left">{{ transaction.branchName }}</td>
            <td class="text-left">{{ transaction.date }}</td>

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
                @click="deleteRequest(transaction)"
              ></i>
            </td>
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
