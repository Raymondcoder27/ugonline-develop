<!-- <script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, type Ref, ref, watch } from "vue";
import CreateBranch from "@/domain/branches/components/CreateBranch.vue"
import { useServicesStore } from "@/domain/services/stores";
import type { Service } from "@/domain/services/types";
import EditService from "@/domain/services/components/EditService.vue";
import ServiceSpecificationDetails from "@/domain/services/views/ServiceSpecificationDetails.vue";
import moment from "moment/moment";
import router from "@/router";
import { useProviderStore } from "@/domain/entities/stores";
import CategorySelector from "@/domain/settings/components/CategorySelector.vue";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import TableLoader from "@/components/TableLoader.vue";

const store = useServicesStore();
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const specModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(16);
const loading: Ref<boolean> = ref(false)
const selectedService: Ref<string> = ref("")
let providerId = ref("")
let status = ref("")
const notify = useNotificationsStore()

const providerStore = useProviderStore()
onMounted(() => {
  loading.value = true
  fetch()
  if (providerStore.providers == undefined) {
    providerStore.fetchProviders(1, 35)
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false
      })
  }
})

function fetch() {
  store.fetchServices(page.value, limit.value)
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false
      notify.error(error.response.data.message)
    })
}

function edit(service: Service) {
  localStorage.setItem("service", JSON.stringify(service))
  editModalOpen.value = true;
}

function spec(service: Service) {
  selectedService.value = service.id
  localStorage.clear()
  localStorage.setItem("service", JSON.stringify(service))
  specModalOpen.value = true;
}

function open(service: Service) {
  router.push({ name: "service-details", params: { id: service.id } })
}

function tag(service: Service) {
  selectedService.value = service.id
  categoryModalOpen.value = true
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss")
}

function close() {
  modalOpen.value = false;
  editModalOpen.value = false;
  specModalOpen.value = false;
}

function next() {
  page.value += 1
  fetch()
}

function previous() {
  page.value -= 1
  fetch()
}

watch(
  () => providerId.value,
  (id: any) => {
    console.log(id)
  },
  { deep: true }
);

watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
    }
  },
);
</script> -->



<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, type Ref, watch } from "vue";
import CreateBranch from "@/domain/branches/components/CreateBranch.vue";
import { useBranchStore } from "@/domain/branches/stores"; // Updated import
import type { Branch } from "@/domain/branches/types"; // Assuming you have a Branch type
import moment from "moment/moment";
import router from "@/router";
import { useProviderStore } from "@/domain/entities/stores";
// import CategorySelector from "@/domain/settings/components/CategorySelector.vue";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
// import TableLoader from "@/components/TableLoader.vue";

const branchStore = useBranchStore(); // Updated store
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(16);
const loading: Ref<boolean> = ref(false);
const selectedBranch: Ref<string> = ref("");
// let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();

onMounted(() => {
  loading.value = true;
  fetchBranches();
});

function fetchBranches() {
  branchStore
    .fetchBranches(page.value, limit.value)
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}

function open(branch: Branch) {
  router.push({ name: "branch-details", params: { id: branch.id } });
}


// edit branch
function edit(branch: Branch) {
  localStorage.setItem("branch", JSON.stringify(branch));
  editModalOpen.value = true;
}

//configure branch
function configure(branch: Branch) {
  localStorage.setItem("branch", JSON.stringify(branch));
  router.push({ name: "branch-configuration", params: { id: branch.id } });
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function close() {
  modalOpen.value = false;
  editModalOpen.value = false;
}

function next() {
  page.value += 1;
  fetchBranches();
}

function previous() {
  page.value -= 1;
  fetchBranches();
}


watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
    }
  },
);
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex">
      <div class="w-full py-1 text-primary-700">
        <i
          class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-code-branch"
        ></i>
        <label class="text-lg mx-1">Branches</label>
      </div>
    </div>
    <div class="flex justify-between my-1">
      <div class="flex flex-col">
        <div class="grid grid-cols-5">
          <input
            class="filter-element e-input"
            type="text"
            placeholder="Search by Name"
          />
          <!-- <select class="filter-element e-select" v-model="providerId">
            <option :value="null">- Select Provider -</option>
            <option
              v-for="(provider, idx) in providerStore.providers"
              :key="idx"
              :value="provider.id"
            >
              {{ provider.name }}
            </option>
          </select> -->
          <select class="filter-element e-select" v-model="status">
            <option :value="null">- Select Status -</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="flex">
        <button
          @click="modalOpen = true"
          class="button btn-sm my-auto"
          type="button"
        >
          <i class="px-1 fa-solid fa-plus"></i> Add Branch
        </button>
      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Name</th>
            <th class="t-header">Manager</th>
            <th class="text-center">Date</th>
            <th class="t-header"></th>
          </tr>
        </thead>
        <thead v-if="loading">
          <tr>
            <th colspan="12" style="padding: 0">
              <div
                class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"
              ></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="body-tr"
            v-for="(branch, idx) in branchStore.branches"
            :key="idx"
          >
            <td width="10px">{{ idx + 1 }}.</td>
            <td>
              <label
                class="cursor-pointer font-bold hover:text-primary-700 mx-2"
              >
                <span class="hover:underline" @click="open(branch)">
                  {{ branch.name }}
                </span>
                <i
                  class="fa-solid fa-link p-1 mx-1 text-gray-600 bg-gray-50 hover:text-primary-700"
                  @click="tag(branch)"
                ></i>
              </label>
            </td>
            <td>
              <label>{{ branch.id }}</label>
            </td>
            <td>
              <label>{{ branch.name }}</label>
            </td>
            <!-- <td class="text-center">
              <i :class="service.currentVersionId
            ? 'text-green-600 fa-solid fa-check'
            : 'text-red-600 fa-solid fa-times'"></i>
            </td> -->
            <td class="text-center">
              <i
                :class="
                  branch.isActive
                    ? 'text-green-600 fa-solid fa-check'
                    : 'text-red-600 fa-solid fa-times'
                "
              ></i>
            </td>

            <!-- <td class="text-center">
              <span>{{ service.status }}</span>
            </td>
            <td class="text-center">
              <span class="text-xs">{{
                convertDateTime(service.createdAt.Time)
              }}</span>
            </td>
            <td class="text-center">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(service)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(service)"
              ></i>
              <i
                class="fa-solid fa-sliders p-1 mx-1 text-primary-700 bg-primary-100 border border-primary-300 hover:text-primary-900"
                @click="spec(service)"
              ></i>
            </td> -->

            <td class="text-center">
  <span>{{ branch.status }}</span>
</td>
<td class="text-center">
  <span class="text-xs">{{ convertDateTime(branch.createdAt) }}</span>
</td>
<td class="text-center">
  <i
    class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
    @click="open(branch)"
  ></i>
  <i
    class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
    @click="edit(branch)"
  ></i>
  <i
    class="fa-solid fa-sliders p-1 mx-1 text-primary-700 bg-primary-100 border border-primary-300 hover:text-primary-900"
    @click="configure(branch)"
  ></i>
</td>

          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <div class="w-full">
        <!-- <div class="flex" v-if="limit == branchStore.branches.length || page > 1"> -->
          <div class="flex" v-if="limit == (branchStore.branches?.length || 0) || page > 1">

          <button v-if="page > 1" class="pagination-button" @click="previous">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{
              page
            }}</label>
          </div>
          <button
            v-if="limit == branchStore.branches.length ?? 1 - 1"
            class="pagination-button"
            @click="next"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateBranch @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="categoryModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CategorySelector :service-id="selectedService" @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="specModalOpen" xl6>
    <!-- Put here whatever makes you smile -->
    <ServiceSpecificationDetails :id="selectedService" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <EditService @cancel="close" />
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
