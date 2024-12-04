// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction, FloatLedger, BackofficeUser, BranchManager, FloatAllocation } from "@/domain/billing/types";
import type { AllocateFloat } from "@/types";

export const useBilling = defineStore("billing", () => {
  // Dummy data for testing

  // use this for dummy transactions
  // <tr class="text-left">
  //           <!-- <th>#</th> -->
  //           <th>Tracking Number</th>
  //           <th>Service</th>
  //           <th>Provider</th>
  //           <th>Till</th>
  //           <!-- <th>Transaction Type</th> -->
  //           <th>Fee</th>
  //           <!-- <th>Status</th> -->
  //           <th>Date</th>
  //           <!-- <th>Actions</th> -->
  //         </tr>

  const dummyTransactions: Transaction[] = [
    { id: 1, trackingNumber: "TA123456",
      service: "Name Reservation", provider: "URSB", till: "Till 001",
      fee: 100, date: "2021-09-01" 
    },
    { id: 2, trackingNumber: "TB123457",
      service: "Create Postal Account", provider: "Posta Uganda",
       till: "Till 002", fee: 200, date: "2021-09-02"
      },
    { id: 3, trackingNumber: "TC123458",
      service: "National ID registration", provider: "NIRA",
       till: "Till 003", fee: 300, date: "2021-09-03" },
  ];


  // use this for dummy float requests
  // <th class="text-left">Date</th>
  // <th class="text-left">Name</th>
  // <th class="text-left">Branch</th>
  // <th class="text-left">Amount</th>
  // <th class="text-left">Actions</th>

  const dummyFloatRequests: FloatRequest[] = [
    { id: 1, requestDate: "2021-09-01", amount: 10000000, status: "Pending", branch: "Branch 1", approvedBy: null },
    { id: 2, requestDate: "2021-09-02", amount: 20000000, status: "Approved", branch: "Branch 2", approvedBy: "Manager One" },
    { id: 3, requestDate: "2021-09-03", amount: 30000000, status: "Rejected", branch: "Branch 3", approvedBy: null },
    { id: 4, requestDate: "2021-09-04", amount: 40000000, status: "Pending", branch: "Branch 4", approvedBy: null },
  ];

    


  const dummyFloatLedgers: FloatLedger[] = [
    { id: 1, name: "Sample FloatLedger 1", balance: 50000000 },
    { id: 2, name: "Sample FloatLedger 2", balance: 12000000 },
    { id: 3, name: "Sample FloatLedger 3", balance: 15000000 },
  ];

  const dummyBackofficeUsers: BackofficeUser[] = [
    { id: 1, username: "admin1", fullName: "Admin User One", role: "Administrator", branch: "Branch 1", status: "Active" },
    { id: 2, username: "manager1", fullName: "Manager User One", role: "Manager", branch: "Branch 2", status: "Active" },
    { id: 3, username: "admin2", fullName: "Admin User Two", role: "Administrator", branch: "Branch 3", status: "Inactive" },
  ];

  // dummy branch manager data
  const dummyBranchManagers: BranchManager[] = [
    { id: 1, username: "manager1", fullName: "Manager User One", role: "Manager", branch: "Branch 1", status: "Active" },
    { id: 2, username: "manager2", fullName: "Manager User Two", role: "Manager", branch: "Branch 2", status: "Active" },
    { id: 3, username: "manager3", fullName: "Manager User Three", role: "Manager", branch: "Branch 3", status: "Inactive" },
  ];

  // dummy float assignment data
  const dummyFloatAllocations: FloatAllocation[] = [
    { id: 1, dateAssigned: "2021-09-01", amount: 13000000, status: "Assigned", branch: "Branch 1" },
    { id: 2, dateAssigned: "2021-09-02", amount: 21000000, status: "Assigned", branch: "Branch 2" },
    { id: 3, dateAssigned: "2021-09-03", amount: 37000000, status: "Assigned", branch: "Branch 3" },
  ];


  // State variables
  const transactions = ref<Transaction[]>(dummyTransactions); // Use dummy data for now
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>(dummyFloatLedgers); // Use dummy data for now
  const backofficeUsers = ref<BackofficeUser[]>(dummyBackofficeUsers);
  const branchManagers = ref<BranchManager[]>(dummyBranchManagers);
  const floatAllocations = ref<FloatAllocation[]>(dummyFloatAllocations);
  const floatRequests = ref<FloatRequest[]>(dummyFloatRequests);

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

  async function fetchBackofficeUsers(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    backofficeUsers.value = dummyBackofficeUsers;
  }

  async function fetchBranchManagers(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    branchManagers.value = dummyBranchManagers;
  }

  async function fetchFloatAllocations(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    floatAllocations.value = dummyFloatAllocations;
  }

  async function fetchFloatRequests(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    floatRequests.value = dummyFloatRequests;
  }

  // function submit() {
  //   let payload = {
  //     amount: form.firstName,
  //     branchId: form.branchId,
  //   };
  //   loading.value = true;
  //   store
  //     .allocateFloat(payload)
  //     .then(() => {
  //       loading.value = false;
  //       notify.success(`Float assigned to ${form.branchId}.`);
  //       emit("cancel");
  //     })
  //     .catch(() => {
  //       loading.value = false;
  //     });
  // }

  // allocate float function, push to the float allocation array
  function allocateFloat(payload: AllocateFloat) {
    floatAllocations.value.push({
      id: floatAllocations.value.length + 1,
      dateAssigned: new Date().toISOString(),
      amount: payload.amount,
      status: "Assigned",
      branch: payload.branchId,
    })
  }

  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    backofficeUsers,
    branchManagers,
    floatAllocations,
    fetchTransactions,
    fetchFloatLedgers,
    fetchBackofficeUsers,  
    fetchBranchManagers,
    fetchFloatAllocations,
    allocateFloat,
  };
});
