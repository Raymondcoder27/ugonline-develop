// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Balance } from "@/domain/balance/types";

export const useBalance = defineStore("balance", () => {
  // Dummy data for testing

  // const dummyTotalBalance: Balance = 300000000; // Set a test value

  // the dummyTotalBalance should have a current value and a new value
  const dummyTotalBalance: Balance = {
    prev: 0,
    current: 300000000
  };


  // State variables
  // const totalBalance: Balance = ref(dummyTotalBalance); /// Set a test value

  // const totalBalance = ref<Balance>(dummyTotalBalance); // Set a test value

  // use the current value of the dummyTotalBalance
  const totalBalance = ref<Balance>(dummyTotalBalance.current); // Set a test value

  // use the current value of the dummyTotalBalance
  async function fetchTotalBalance() {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = dummyTotalBalance.current;
  }

  // incase balance has been increased
  // async function increaseTotalBalance(amount: number) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/total-balance`);
  //   // const data = await response.json();
  //   // Use dummy data for now
  //   totalBalance.value = totalBalance.value + amount;
  // }

  // incase balance has been increased, update the current value of the dummyTotalBalance, but keep the prev value
  async function increaseTotalBalance(amount: number) {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = {
      prev: totalBalance.value,
      current: totalBalance.value + amount
    };
  }

  // incase balance has been decreased
  async function decreaseTotalBalance(amount: number) {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = {
      prev: totalBalance.value,
      current: totalBalance.value - amount
    }
  }

  return {
    totalBalance,
    fetchTotalBalance
  };
});
