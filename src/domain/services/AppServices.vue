<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, type Ref, ref, watch, reactive, computed } from "vue";
import CreateService from "@/domain/services/components/CreateService.vue";
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
import { useDebounceFn } from "@vueuse/core";
// import { subscribe } from "diagnostics_channel";

const store = useServicesStore();
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const specModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(16);
const loading: Ref<boolean> = ref(false);
const selectedService: Ref<string> = ref("");
let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();

const providerStore = useProviderStore();
onMounted(() => {
  loading.value = true;
  fetch();
  if (providerStore.providers == undefined) {
    providerStore
      .fetchProviders(1, 35)
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false;
      });
  }
});

// function fetch() {
//   store
//     .fetchServices(page.value, limit.value)
//     .then(() => (loading.value = false))
//     .catch((error: ApiError) => {
//       loading.value = false;
//       notify.error(error.response.data.message);
//     });
// }

function edit(service: Service) {
  localStorage.setItem("service", JSON.stringify(service));
  editModalOpen.value = true;
}

function spec(service: Service) {
  selectedService.value = service.id;
  localStorage.clear();
  localStorage.setItem("service", JSON.stringify(service));
  specModalOpen.value = true;
}

function open(service: Service) {
  router.push({ name: "service-details", params: { id: service.id } });
}

function tag(service: Service) {
  selectedService.value = service.id;
  categoryModalOpen.value = true;
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function close() {
  modalOpen.value = false;
  editModalOpen.value = false;
  specModalOpen.value = false;
}

function next() {
  page.value += 1;
  fetch();
}

function previous() {
  page.value -= 1;
  fetch();
}

watch(
  () => providerId.value,
  (id: any) => {
    console.log(id);
  },
  { deep: true }
);

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  }
);

// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS",
    },
  ],
});

const updateFilter = useDebounceFn(
  () => {
    fetch();
  },
  300,
  { maxWait: 5000 }
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

// const filteredServices = computed(() => {
//   return store.services.filter(service => service.status === 'listed');
// });

// const listedServices = computed(() => {
//   return store.services.filter((service) => service.status === "listed");
// });

// const activeServices = computed(() => {
//   return store.subscribedServices.filter(
//     (service) => service.status === "subscribed"
//   );
// });

// fetch services
// function fetchServices() {
//   filter.limit = limit.value;
//   filter.page = page.value;
//   store.fetchServices(filter);
// }

function fetchServices() {
  filter.offset = (page.value - 1) * limit.value; // Update offset
  filter.limit = limit.value;
  filter.page = page.value; // Ensure pagination is aligned
  store.fetchServices(filter); // Fetch services
}

// function subscribe(serviceId: string) {
//   store.subscribeToServiceById(serviceId)
//     .then(() => {
//       notify.success("Service subscribed successfully!");
//     })
//     .catch((error: ApiError) => {
//       notify.error("Failed to subscribe to service: " + error.message);
//     });
// }

// don't use .then and .catch just make the function synchronous
function subscribe(serviceId: string) {
  try {
    store.subscribeToService(serviceId);
    notify.success("Service subscribed Successfully!");
  } catch (error) {
    notify.error("Failed to subscribe to service: " + error.message);
  }
}

function unsubscribeFromService(serviceId: string) {
  try {
    store.unsubscribeFromService(serviceId);
    notify.success("Service unsubscribed successfully!");
  } catch (error) {
    notify.error("Failed to unsubscribe from service: " + error.message);
  }
}

// watch for changes in the subscription status and refetch services

// onMounted(() => {
//   store.fetchServices();
//   store.fetchSubscribedServices();
// });
</script>

<template>
  <div class="flex">
    <!-- <div class="w-full shadow-lg bg-white rounded p-2">
      <div class="flex">
        <div class="w-full py-1 text-primary-700">
          <i
            class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-list"
          ></i>
          <label class="text-lg mx-1">Services</label>
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
            <select class="filter-element e-select" v-model="providerId">
              <option :value="null">- Select Provider -</option>
              <option
                v-for="(provider, idx) in providerStore.providers"
                :key="idx"
                :value="provider.id"
              >
                {{ provider.name }}
              </option>
            </select>
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
            <i class="px-1 fa-solid fa-plus"></i> Request Service
          </button>
        </div>
      </div>
      <div class="flex my-1">
        <table class="table">
          <thead>
            <tr class="header-tr">
              <th class="t-header">#</th>
              <th class="t-header">Name</th>
              <th class="t-header">Provider</th>
              <th class="text-center">Access Tier</th>
              <th class="text-center">Status</th>
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
              v-for="(service, idx) in store.services"
              :key="idx"
            >
              <td width="10px">{{ idx + 1 }}.</td>
              <td>
                <label
                  class="cursor-pointer font-bold hover:text-primary-700 mx-2"
                >
                  <span class="hover:underline" @click="open(service)">
                    {{ service.name }}
                  </span>
                  <i
                    class="fa-solid fa-link p-1 mx-1 text-gray-600 bg-gray-50 hover:text-primary-700"
                    @click="tag(service)"
                  ></i>
                </label>
              </td>
              <td>
                <label>{{ service.providerName }}</label>
              </td>
              <td>
                <label>{{ service.accessibilityTier }}</label>
              </td>
              <td class="text-center">
                <i
                  :class="
                    service.currentVersionId
                      ? 'text-green-600 fa-solid fa-check'
                      : 'text-red-600 fa-solid fa-times'
                  "
                ></i>
              </td>
              <td class="text-center">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex">
        <div class="w-full">
          <div class="flex" v-if="limit == store.services?.length || page > 1">
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
              v-if="limit == store.services?.length ?? 1 - 1"
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
    </div> -->

    <div class="block">
      <!-- Styled Search Bar -->
      <div
        class="flex px-4 py-3 bg-white shadow-md rounded-lg justify-between items-center mb-3"
      >
        <!-- <input
          type="text"
          placeholder="Search..."
          class="w-full md:w-2/3 lg:w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-red-700"
        /> -->
        <!-- <input
          type="text"
          placeholder="Search Services provided by Ministries, Departments and Agencies"
          class="w-full md:w-2/3 lg:w-full px-4 py-2 border border-gray-300 rounded-full text-sm"
        />
        <button
          class="ml-4 px-6 py-2 bg-red-700 text-white rounded-md text-sm hover:bg-primary-800 transition duration-300 ease-in-out"
          @click="search"
        >
          Search
        </button> -->

        <div
          class="w-[50vw] bg-white rounded-md flex items-center justify-center border border-gray-50 px-4 focus:ring-2 focus:ring-red-500"
        >
          <input
            type="text"
            placeholder="Search Services provided by Ministries, Departments and Agencies"
            class="w-full text-sm border-none outline-none bg-white"
          />
          <i class="fas fa-search p-2 cursor-pointer text-gray-500 text-lg"></i>

          <!-- <button
      class="ml-4 px-6 py-2 bg-red-700 text-white rounded-md text-sm hover:bg-primary-600 transition duration-300 ease-in-out"
      @click="search"
    >
      Search
    </button> -->
        </div>
      </div>
      <div class="flex justify-end items-center mt-2 mb-2">
        <!-- Previous Button -->
        <button
          class="px-1 py-0.5 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
          :disabled="page <= 1"
          @click="previous"
        >
          <i class="fa-solid fa-arrow-left"></i>
        </button>

        <!-- Page Number Display -->
        <span class="mx-4 text-lg font-semibold text-gray-700">{{ page }}</span>

        <!-- Next Button -->
        <button
          class="px-1 py-0.5 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'opacity-50 cursor-not-allowed': store.services.length < limit,
          }"
          :disabled="store.services.length < limit"
          @click="next"
        >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- Service Cards Section -->
      <div class="grid grid-cols-4 gap-3">
  <!-- Service Tile -->
  <div
    v-for="service in store.services"
    :key="service.id"
    class="service service-active p-4 bg-white shadow rounded transform transition duration-300 ease-in-out hover:scale-105 flex flex-col justify-between"
  >
    <!-- Top Section -->
    <div>
      <div class="flex justify-between items-center">
        <img
          :src="service.thumbnail"
          alt=""
          class="w-10 h-10 object-cover"
        />
      </div>
      <hr class="my-2" />
      <div class="text-bold text-sm font-bold" v-if="service">
        {{ service.name }}
      </div>
      <div v-else>
        <p>Service not found.</p>
      </div>
      <div class="h-15 overflow-hidden">
        <span class="text-xs text-gray-800">
          {{ service.description }}
        </span>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="mt-4">
      <p
        class="font-bold text-xs w-full text-white bg-red-700 p-1 rounded-md text-center cursor-pointer hover:scale-105 hover:bg-red-800"
        @click="subscribe(service.id)"
      >
        <i class="fa fa-check-square"></i>
        Subscribe
      </p>
    </div>
  </div>
</div>

    </div>

    <div
      class="bg-white text-xs rounded-md w-1/3 ml-3 text-center mb-2 h-[86vh]"
    >
      <div class="block mt-2 mb-4">
        <!-- <p class="text-lg mx-1">Subscriptions</p> -->

        <!-- <input
          v-if="filter.filter !== undefined"
          input-type="text"
          v-model="filter.filter[2].operand"
          class="rounded-full filter-element e-input text-xs mt-1"
          type="text"
          placeholder="Search Subscribed Services"
        /> -->

        <div
          class="mt-3 mx-2 px-2 bg-white rounded-md flex items-center justify-between border border-gray-50 focus:ring-2 focus:ring-red-500"
        >
          <input
            type="text"
            placeholder="Search Subscribed Services"
            class="text-sm border-none outline-none bg-white"
          />
          <i
            class="fas fa-search py-2 cursor-pointer text-gray-500 text-lg"
          ></i>
        </div>
        <hr class="mt-3 text-gray-100" />
      </div>
      <!-- all services subscribed looped from subscribedServices store -->
      <div
        class="flex flex-col justify-between mt-3 text-left"
        v-for="(subscribedService, id) in store.subscribedServices"
        :key="id"
      >
        <!-- <div
        class="flex flex-col justify-between mt-3 text-left"
        v-for="(subscribedService, id) in activeServices"
        :key="id"
      > -->
        <!-- <li width="10px">{{ idx + 1 }}</li> -->
        <li class="list-none flex justify-between mx-3">
          <span
            class="hover:underline cursor-pointer font-semibold text-gray-700"
            @click="open(service)"
          >
            {{ subscribedService.name }}
          </span>

          <!-- Unsubscribe button -->
          <button
            class="text-xs rounded-md p-1 font-semibold text-black-600 bg-gray-100 border border-gray-200 hover:text-red-700 hover:bg-red-300"
            @click="unsubscribeFromService(subscribedService.id)"
          >
            Unsubscribe
          </button>
        </li>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateService @cancel="close" />
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
.count {
  @apply py-2 text-center border border-gray-100 rounded bg-white mx-1 shadow;
}
</style>
