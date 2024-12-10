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
import ServiceCards from "@/domain/services/components/ServiceCards.vue";
import SubscribedServices from "@/domain/services/components/SubscribedServices.vue";

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

// const providerStore = useProviderStore();
// onMounted(() => {
//   loading.value = true;
//   fetch();
//   if (providerStore.providers == undefined) {
//     providerStore
//       .fetchProviders(1, 35)
//       .then(() => (loading.value = false))
//       .catch(() => {
//         loading.value = false;
//       });
//   }
// });

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
      <div class="block w-2/3">
      <!-- Service Cards Area -->
      <ServiceCards :services="store.services" @subscribe="subscribe" />
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
