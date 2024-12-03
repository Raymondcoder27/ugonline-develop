// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction, FloatLedger } from "@/domain/billing/types";

export const useBilling = defineStore("billing", () => {
  // Dummy data for testing
  const dummyTransactions: Transaction[] = [
    { id: 1, amount: 100, description: "Sample Transaction 1", branchName: "Branch 1", manager: "Manager 1", transactionType: "Credit", status: "Approved", date: "2021-09-01" },
    { id: 2, amount: 200, description: "Sample Transaction 2", branchName: "Branch 2", manager: "Manager 2", transactionType: "Debit", status: "Pending", date: "2021-09-02" },
    { id: 3, amount: 300, description: "Sample Transaction 3", branchName: "Branch 3", manager: "Manager 3", transactionType: "Credit", status: "Approved", date: "2021-09-03" },
  ];

  const dummyFloatLedgers: FloatLedger[] = [
    { id: 1, name: "Sample FloatLedger 1", balance: 500 },
    { id: 2, name: "Sample FloatLedger 2", balance: 1000 },
    { id: 3, name: "Sample FloatLedger 3", balance: 1500 },
  ];

  const dummyBackofficeUsers: BackofficeUser[] = [
    { id: 1, username: "admin1", fullName: "Admin User One", role: "Administrator", branch: "Branch 1", status: "Active" },
    { id: 2, username: "manager1", fullName: "Manager User One", role: "Manager", branch: "Branch 2", status: "Active" },
    { id: 3, username: "admin2", fullName: "Admin User Two", role: "Administrator", branch: "Branch 3", status: "Inactive" },
  ];

  // State variables
  const transactions = ref<Transaction[]>(dummyTransactions); // Use dummy data for now
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>(dummyFloatLedgers); // Use dummy data for now

  // Actions to fetch data
  async function fetchTransactions(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/transactions?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    transactions.value = dummyTransactions;
    totalAmount.value = 600;  // Set a test value
    totalBalance.value = 3000; // Set a test value
  }

  async function fetchFloatLedgers(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/float-ledgers?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    floatLedgers.value = dummyFloatLedgers;
  }

  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    fetchTransactions,
    fetchFloatLedgers,
  };
});
