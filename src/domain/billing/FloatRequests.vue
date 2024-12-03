<script setup lang="ts">
import { useBilling } from "@/domain/billing/stores";
import { onMounted, ref } from "vue";

const store = useBilling();
const page = ref(1);
const limit = ref(10);

onMounted(() => {
  store.fetchTransactions();
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

</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="text-left">#</th>
            <th class="text-left">Name</th>
            <th class="text-left">Branch</th>
            <th class="text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, idx) in store.transactions" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>
              <label class="font-bold py-1">{{ transaction.description }}</label>
            </td>
            <td class="text-center">{{ transaction.branchName }}</td>
            <td class="text-center">{{ transaction.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex">
      <div class="w-full">
        <div class="flex">
          <button v-if="page > 1" class="pagination-button" @click="previous">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{ page }}</label>
          </div>

          <button v-if="store.transactions.length === store.limit" class="pagination-button" @click="next">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
