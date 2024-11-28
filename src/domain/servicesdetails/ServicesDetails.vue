<script setup lang="ts">
import { ref, type Ref } from "vue";
import BackofficeAccounts from "@/domain/accounts/BackofficeAccounts.vue";
import UserAccounts from "@/domain/accounts/UserAccounts.vue";

const activeTab: Ref<string> = ref("backoffice")

function select(tab: string) {
  activeTab.value = tab
}

</script>

<template>
  <div class="flex flex-col w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex">
      <div class="w-full py-1">
        <!-- <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-list"></i> -->
        <label class="text-xl mx-1 font-semibold">Services We Provide</label>
        <p class="ml-1">Detailing all the services we offer with small notes on each but also the price for all</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}

.tab{
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active{
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}

</style>
