// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Balance } from "@/domain/balance/types";

export const useBalance = defineStore("balance", () => {
  // Dummy data for testing

  let dummyTotalBalance: Balance = 300000000; // Set a test value

  // State variables
  // const totalBalance: Balance = ref(dummyTotalBalance); /// Set a test value

  const totalBalance = ref<Balance>(dummyTotalBalance); // Set a test value

  // Actions to fetch data
  async function fetchTotalBalance() {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = dummyTotalBalance;
  }

  // incase balance has been increased
  async function increaseTotalBalance(amount: number) {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = totalBalance.value + amount;
  }

  // incase balance has been decreased
  async function decreaseTotalBalance(amount: number) {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = totalBalance.value - amount;
  }




  return {
    totalBalance,
    fetchTotalBalance
  };
});
