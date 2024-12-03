import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Branch } from "@/domain/branches/types"; // Assuming you have a Branch type

export const useBranchStore = defineStore("branches", () => {
  const branches: Ref<Branch[] | undefined> = ref();
  const branch: Ref<Branch | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);

  async function fetchBranches(page: number, limit: number) {
    isLoading.value = true;
    try {
      const { data } = await api.get(`/branches?page=${page}&limit=${limit}`);
      branches.value = data;
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
  };
});
