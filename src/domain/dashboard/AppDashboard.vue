<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBranchStore } from "@/domain/branches/stores";
import { useBilling } from "@/domain/billing/stores";
import { useServicesStore } from "@/domain/services/stores";
import { useAccounts } from "@/domain/accounts/stores";
// import { useBalance } from "@/domain/balance/stores";


// const totalServiceSubscriptions = ref(0);

// const store = useDashboard();
const branchStore = useBranchStore();
const billingStore = useBilling();
const servicesStore = useServicesStore();
const accountStore = useAccounts();
// const balanceStore = useBalance();



const totalServiceSubscriptions = servicesStore.subscribedServices?.length || 0;

const totalBranches = branchStore.branches?.length || 0;

const totalBranchManagers = accountStore.managerAccounts?.length || 0;

const totalFloatRequests = billingStore.floatRequests?.length || 0;

const totalTransactions = billingStore.transactions?.length || 0;

// const totalBalance = balanceStore.balance;

const totalBackOfficeAccounts = accountStore.backofficeAccounts?.length || 0;






// const store = useDashboard();
const page = ref(1);
const limit = ref(15);


onMounted(() => {
  // store.fetchDashboardData();
  branchStore.fetchBranches();
  billingStore.fetchFloatRequests();
  servicesStore.fetchSubscribedServices();
  accountStore.fetchManagerAccounts();
  accountStore.fetchBackofficeAccounts();
  // balanceStore.fetchBalance();
});
</script>

<template>
  <div class="grid grid-cols-3 gap-3 py-2">
    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">79</p> -->
        <p class="text-xl font-bold py-2">{{ totalServiceSubscriptions }}</p>
        <!-- <p class="text-xl font-bold py-2">{{ servicesStore.servicesSubscribed?.length || 0 }}</p> -->
        <p class="text-xs">Service Subscriptions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">4</p> -->
        <p class="text-xl font-bold py-2">{{ totalBranches }}</p>

        <p class="text-xs">Branches</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">3</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ accountStore.branchManagers.length }}</p> -->
        <p class="text-xl font-bold py-2">{{ totalBranchManagers }}</p>
        <p class="text-xs">Branch Managers</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">17</p> -->
        <p class="text-xl font-bold py-2">{{ totalBackOfficeAccounts }}</p>
        <p class="text-xs">BackOffice Accounts</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">17</p>
        <!-- <p class="text-xl font-bold py-2">{{ store.tills }}</p> -->
        <p class="text-xs">Tills</p>
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
        <!-- <p class="text-xl font-bold py-2">4</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ billingStore.floatRequests.length }}</p> -->
        <p class="text-xl font-bold py-2">{{ totalFloatRequests }}</p>
        <p class="text-xs">Pending Float Requests</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">123</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ billingStore.serviceTransactions.length }}</p> -->
        <p class="text-xl font-bold py-2">{{ totalTransactions }}</p>
        <p class="text-xs">Service Transactions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">130,400,000/=</p>
        <!-- <p class="text-xl font-bold py-2">{{ balanceStore.balance }}</p> -->
        <p class="text-xs">Balance</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count {
  @apply py-2 text-center border border-gray-100 rounded bg-white mx-1 shadow;
}
</style>