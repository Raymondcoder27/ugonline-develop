<script setup lang="ts">
</script>

<template>
  <div class="flex">
    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">79</p>
        <p class="text-xs font-semibold">Service Subscriptions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">4</p>
        <p class="text-xs font-semibold">Branches</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">3</p>
        <p class="text-xs font-semibold">Branch Managers</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">17</p>
        <p class="text-xs font-semibold">Tills</p>
      </div>
    </div>

    <!-- <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">17</p>
        <p class="text-xs">Agents</p>
      </div>
    </div> -->

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">4</p>
        <p class="text-xs font-semibold">Pending Float Requests</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">123</p>
        <p class="text-xs font-semibold">Service Transactions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">13,400,000/=</p>
        <p class="text-xs font-semibold">Balance</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count {
  @apply py-2 text-center border border-gray-100 rounded bg-white mx-1 shadow;
}
</style>