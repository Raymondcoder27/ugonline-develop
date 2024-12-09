<script setup lang="ts">
import { onMounted, reactive, ref, computed, type Ref } from "vue";
import { useBranchStore } from "@/domain/branches/stores";
import { useNotificationsStore } from "@/stores/notifications";
import { useAccounts } from "@/domain/accounts/stores";

const branchStore = useBranchStore();
const store = useAccounts();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

const form = reactive({
  managerId: "",
  branchId: "",
});

const emit = defineEmits(["cancel", "managerAllocated"]);

onMounted(() => {
  loading.value = true;
  Promise.all([
    branchStore.fetchBranches(),
    branchStore.fetchManagers(), // Fetch branch managers
    store.fetchBackofficeAccounts(), // Fetch back office accounts
  ]).finally(() => {
    loading.value = false;
  });
});

// Merge branch managers and back office accounts into a single dataset
const allManagers = computed(() => {
  const managersFromBranchStore = branchStore.managers || [];
  const backofficeAccounts = store.backofficeAccounts || [];
  return [...managersFromBranchStore, ...backofficeAccounts];
});

// Search and filter functionality
const searchQuery = ref("");
const filteredManagers = computed(() => {
  if (!searchQuery.value.trim()) {
    return allManagers.value;
  }
  return allManagers.value.filter((manager) =>
    `${manager.firstName} ${manager.lastName}`
      .toLowerCase()
      .includes(searchQuery.value.trim().toLowerCase())
  );
});

function submit(managerId: string) {
  const payload = {
    managerId,
    branchId: form.branchId,
  };
  loading.value = true;
  branchStore
    .allocateManager(payload)
    .then(() => {
      notify.success("Manager allocated to branch successfully.");
      form.managerId = "";
      form.branchId = "";
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="bg-white p-6 shadow-md rounded-lg">
    <p class="text-xl font-bold mb-2">Assign Manager</p>
    <p class="text-sm text-gray-500 mb-4">
      Select a manager from the table to assign them to a branch.
    </p>

    <!-- Search Box -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Search managers by name..."
      />
    </div>

    <!-- Manager Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Phone</th>
            <th class="px-4 py-2 text-center text-sm font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading Indicator -->
          <tr v-if="loading">
            <td colspan="4" class="px-4 py-4 text-center">
              <div class="animate-pulse bg-blue-300 h-4 w-full rounded"></div>
            </td>
          </tr>

          <!-- Managers List -->
          <tr
            v-for="manager in filteredManagers"
            :key="manager.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-2">
              {{ manager.firstName }} {{ manager.lastName }}
            </td>
            <td class="px-4 py-2">{{ manager.email }}</td>
            <td class="px-4 py-2">{{ manager.phone }}</td>
            <td class="px-4 py-2 text-center">
              <button
                @click="submit(manager.id)"
                :disabled="loading"
                class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Assign
              </button>
            </td>
          </tr>

          <!-- No Results Found -->
          <tr v-if="!filteredManagers.length && !loading">
            <td colspan="4" class="px-4 py-4 text-center text-gray-500">
              No managers found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
