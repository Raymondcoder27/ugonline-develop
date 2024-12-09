import { defineStore } from "pinia";
import { reactive } from "vue";

export interface TotalBalance {
  prev: number;
  current: number;
}

export const useBalance = defineStore("balance", () => {
  // Reactive state for total balance
  const totalBalance = reactive<TotalBalance>({
    prev: 300000000, // Initial previous balance
    current: 300000000, // Initial current balance
  });

  // Fetch the total balance (simulate an API call or real data fetching)
  async function fetchTotalBalance() {
    // Simulate fetching balance from an API and updating state
    const fetchedBalance = {
      prev: totalBalance.current, // For now, use current as previous
      current: 300000000, // Replace with actual fetched balance
    };
    totalBalance.prev = fetchedBalance.prev;
    totalBalance.current = fetchedBalance.current;
  }

  // Increase the total balance and update "prev"
  function increaseTotalBalance(amount: number) {
    totalBalance.prev = totalBalance.current;
    totalBalance.current += amount;
  }

  // Decrease the total balance and update "prev"
  function decreaseTotalBalance(amount: number) {
    totalBalance.prev = totalBalance.current;
    totalBalance.current -= amount;
  }

  return {
    totalBalance,
    fetchTotalBalance,
    increaseTotalBalance,
    decreaseTotalBalance,
  };
});
