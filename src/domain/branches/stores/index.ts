import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Branch } from "@/domain/branches/types"; // Assuming you have a Branch type
import type { AllocateManager } from "@/types";

export const useBranchStore = defineStore("branches", () => {
  const branches: Ref<Branch[] | undefined> = ref();
  const branch: Ref<Branch | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);
  const managerAllocations: Ref<AllocateManager[]> = ref([]);

  // Dummy data for testing purposes
  const dummyBranches: Branch[] = [
    { id: 1, name: "Branch 1", location: "Location 1", manager: "", status: "Active" },
    { id: 2, name: "Branch 2", location: "Location 2", manager: "", status: "Inactive" },
    { id: 3, name: "Branch 3", location: "Location 3", manager: "", status: "Active" },
    { id: 4, name: "Branch 4", location: "Location 4", manager: "", status: "Inactive" },
  ];

  // Add new branch to the store
  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch);
  // };

  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch); // Directly add the branch to the array
  // };

  // const allocateManager = (payload: AllocateManager) => {
  //   managerAllocations.value.push({
  //     id: managerAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     branch: payload.branchId,
  //     manager: payload.managerId,
  //     status: "Assigned"
  //   });

  const addBranch = (newBranch: Branch) => {
    branches.value?.push({
      id: branches.value?.length + 1,
      name: newBranch.name,
      location: newBranch.location,
      status: newBranch.status,
    })

    // allocate branch manager
    // const manager = branchManagers.value.find((manager) => manager.id === newBranch.managerId);
    // if (manager) {
    //   manager.branch = newBranch.id;
    // }
  }

  const allocateManager = (payload: AllocateManager) => {
    const branchToUpdate = branches.value?.find(branch => branch.id === payload.branchId);
    if (branchToUpdate) {
      branchToUpdate.manager = payload.managerId;
    } else {
      console.warn(`Branch with ID ${payload.branchId} not found.`);
    }
  };


   // Delete branch from the store
   const deleteBranch = (branchId: number) => {
    branches.value = branches.value?.filter((branch) => branch.id !== branchId); // Remove the branch by ID
  };
  
  
  

  async function fetchBranches(page: number, limit: number) {
    isLoading.value = true;
    try {
      // Uncomment the following line to fetch data from the API once ready
      // const { data } = await api.get(`/branches?page=${page}&limit=${limit}`);
      
      // For now, use the dummy data for testing
      branches.value = dummyBranches; // Use dummy data for testing

      // Uncomment below to assign the API data when it's available
      // branches.value = data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    branches,
    branch,
    managerAllocations,
    fetchBranches,
    allocateManager,
    addBranch,
    deleteBranch,
  };
});
