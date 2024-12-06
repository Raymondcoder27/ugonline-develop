// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { TotalBalance } from "@/domain/balance/types";

export const useBalance = defineStore("balance", () => {
  // Dummy data for testing

  // const dummyTotalBalance: Balance = 300000000; // Set a test value

  // the dummyTotalBalance should have a current value and a new value
  const dummyTotalBalance: TotalBalance = {
    prev: 0,
    current: 300000000
  };

  // use the current value of the dummyTotalBalance
  const totalBalance = ref<TotalBalance>(dummyTotalBalance.current); // Set a test value

  // use the current value of the dummyTotalBalance


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
    console.log("prev: ", totalBalance.value.prev, "current: ", totalBalance.value.current);
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
    console.log("prev: ", totalBalance.value.prev, "current: ", totalBalance.value.current);
    // console.log(totalBalance.value);
  }

  async function fetchTotalBalance() {
    // Simulate API call
    // const response = await fetch(`/api/total-balance`);
    // const data = await response.json();
    // Use dummy data for now
    totalBalance.value = dummyTotalBalance.current;
  }


  return {
    totalBalance,
    fetchTotalBalance,
    increaseTotalBalance,
    decreaseTotalBalance
  };
});
