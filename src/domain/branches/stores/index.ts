import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Branch } from "@/domain/branches/types"; // Assuming you have a Branch type

export const useBranchStore = defineStore("branches", () => {
  const branches: Ref<Branch[] | undefined> = ref();
  const branch: Ref<Branch | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);

  // Dummy data for testing purposes
  const dummyBranches: Branch[] = [
    { id: 1, name: "Branch 1", location: "Location 1", status: "Active" },
    { id: 2, name: "Branch 2", location: "Location 2", status: "Inactive" },
    { id: 3, name: "Branch 3", location: "Location 3", status: "Active" },
    { id: 4, name: "Branch 4", location: "Location 4", status: "Inactive" },
  ];

  // Add new branch to the store
  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch);
  // };

  const addBranch = (newBranch: Branch) => {
    branches.value.push(newBranch); // Directly add the branch to the array
  };

  // delete branch
  // function deleteBranch(branch: Branch) {
  //   branchStore.deleteBranch(branch.id);
  //   fetchBranches();  // Refetch the branches after deleting
  //   notify.success("Branch Deleted");
  // }


  // function deleteBranch(branch: Branch) {
  //   branchStore.deleteBranch(branch.id);
  //   fetchBranches();  // Refetch the branches after deleting
  //   notify.success("Branch Deleted");
  // }

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
    fetchBranches,
    addBranch,
    deleteBranch,
  };
});
