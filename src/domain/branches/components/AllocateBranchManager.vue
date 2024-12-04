<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from "vue";
import { useBranchStore } from "@/domain/branches/stores";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import { defineEmits } from "vue";
import { useAccounts } from "@/domain/accounts/stores";

const branchStore = useBranchStore();
const store = useAccounts();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

type BranchForm = {
  branchId: string;
  name: string;
};

const form = reactive({
  branchId: "",
  name: "",
});

const emit = defineEmits(["cancel", "managerAllocated"]);

onMounted(() => {
  loading.value = true;
  branchStore.fetchBranches().finally(() => (loading.value = false));
});

// function submit() {
//   let payload = {
//     name: form.name,
//   };
//   loading.value = true;
//   store
//     .addBranch(payload)
//     .then(() => {
//       notify.success("Branch Created");
//       emit("created");
//     })
//     .catch((error: ApiError) => {
//       notify.error(error.response.data.message);
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// }

// function submit() {
//   let payload = {
//     name: form.name,
//   };
//   loading.value = true;
//   branchStore.addBranch(payload); // Simply add the branch
//   notify.success("Branch Created");
//   emit("managerAllocated");
//   loading.value = false;
// }


function submit() {
  let payload = {
    name: form.name,
  };
  loading.value = true;
  store.addBranch(payload); // Simply add the branch
  notify.success("Branch Created");
  emit("managerAllocated");
  loading.value = false;
}
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Allocate Manager</p>
    <p class="text-sm text-gray-500">
        The individual responsible for overseeing branch operations, managing staff, and ensuring smooth service delivery to agents and the public.
    </p>

    <form @submit.prevent="submit" class="pt-5">
        <select
          v-model="form.branchId"
          class="noFocus form-element e-input w-full"
        >
          <option :value="null">-- Select Manager --</option>
          <option
            v-for="(account, idx) in store.managerAccounts"
            :key="idx"
            :value="account.firstName"
          >
            {{ account.firstName }}
          </option>
        </select>
        <div class="flex my-2 py-5">
        <div class="w-6/12 px-1">
          <button class="button-outline" type="button" @click="emit('cancel')">
            <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
        <div class="w-6/12 px-1">
          <button class="button" type="submit">
            <i class="fa-solid fa-hand-pointer"></i> Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}
</style>
