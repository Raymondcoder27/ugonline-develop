<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, type Ref, ref, watch, reactive } from "vue";
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
import { useDebounceFn } from "@vueuse/core"


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

function fetch() {
  store
    .fetchServices(page.value, limit.value)
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}

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

interface Service {
  id: number;
  service: string;
  description: string;
  // name: string;
  // thumbnail: string;
  // email: string;
  // phone: string;
  // address: string;
}

const services = ref<Service[]>([
  {
    id: 1,
    service: "Post Office Account",
    description: "Open a Post Office Account",
    // name: "Posta Uganda",
    // thumbnail: "/assets/coa-19c4edfc.png",
    // email: "info@ugapost.co.ug",
    // phone: "+256784944479",
    // address: "Plot 35 Kampala Road, Kampala",
  },
  {
    id: 2,
    service: "Agricultural Research",
    description: "Request for Agricultural Research",
    // name: "National Agricultural Research Organization",
    // thumbnail: "/assets/coa-19c4edfc.png",
    // email: "info@naro.go.ug",
    // phone: "+256-41-320512",
    // address: "Plot 11-13, Lugard Avenue, Entebbe",
  },
  {
    id: 3,
    service: "National ID Registration",
    description: "Apply for a National ID",
    // name: "National Identification & Registration Authority",
    // thumbnail: "/assets/coa-19c4edfc.png",
    // email: "info@nira.com",
    // phone: "0800211700",
    // address: "National Independence Grounds, Kololo Airstrip",
  },
  {
    id: 4,
    service: "Land Title Registration",
    description: "Apply for a Land Title",
    // name: "Ministry of Lands and Urban Development",
    // thumbnail: "/assets/coa-19c4edfc.png",
    // email: "info@mlhud.go.ug",
    // phone: "0414355355",
    // address: "Dewinton Road",
  },
  {
    id: 5,
    service: "Name Reservation",
    description: "Reserve a Business Name",
    // name: "URSB",
    // thumbnail: "/assets/coa-19c4edfc.png",
    // email: "ursb@ursb.go.ug",
    // phone: "0312211211",
    // address: "Plot 1 Baskerville Avenue",
  },
  {
    id: 9,
    service: "Passport Application",
    description: "Apply for a Passport",
    // name: "Ministry of Internal Affairs",
    // thumbnail: "/assets/coa-19c4edfc.png",
    // email: "info@moia.go.ug",
    // phone: "0312123123",
    // address: "",
  },
]);


// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page:0,
  sort: [
    {
      field: "firstname",
      order: "ASC"
    }
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS"
    },
  ]
})

const updateFilter = useDebounceFn(
  () => {
    fetch()
  },
  300,
  { maxWait: 5000 }
)

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
)
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

    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="service service-active p-4 bg-white shadow rounded"
      >
        <div class="flex justify-between items-center">
          <img :src="service.thumbnail" alt="Service Thumbnail" class="w-10 h-10 object-cover">
          <!-- <img class="w-10 h-10 object-cover" />
          <i
            class="fa-solid fa-square-arrow-up-right text-lg text-gray-600"
          ></i> -->
        </div>
        <hr class="my-2" />
        <p class="font-bold text-gray-700 my-1">{{ service.service }}</p>
        <table class="text-sm text-gray-600">
          <tbody>
            <tr>
              <td class="font-semibold">Description:</td>
              <td class="px-2">{{ service.description }}</td>
            </tr>
            <!-- <tr>
              <td class="font-semibold">Provider:</td>
              <td class="px-2">{{ service.name }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Email:</td>
              <td class="px-2">{{ service.email }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Phone:</td>
              <td class="px-2">{{ service.phone }}</td>
            </tr>
            <tr>
              <td class="font-semibold">Address:</td>
              <td class="px-2">{{ service.address }}</td>
            </tr> -->
          </tbody>
        </table>
        <p class="font-bold text-xs text-gray-600 bg-gray-100 rounded-md w-1/3 text-center">PENDING</p>
      </div>
    </div>

    <div class="bg-white text-xs rounded-md w-1/3 ml-3 text-center">

      <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input text-xs mt-3" type="text" placeholder="Search By MDA or Service Name" />
      <!-- all services -->
      <div class="pt-2">
        <!-- <div class="count">Total Services: {{ services.length }}</div>
      <div class="count">Active Services: {{ services.length }}</div>
      <div class="count">Inactive Services: 0</div> -->

      <!-- drop down of MDAs -->
      <select class="filter-element text-xs w-full">
        <option :value="null">- NIRA</option>
        <!-- services offered by NIRA -->
        <option value="pending">National ID Registration
          <!-- add a toggle but set it to off -->
          <i class="fa-solid fa-toggle-off text-red-600"></i>
        </option>
        <option value="active">Passport Application</option>
        <option value="blocked">Name Reservation</option>
      </select>

      <!-- drop down of other MDAs -->
      <select class="filter-element w-full text-xs">
        <option :value="null">- URSB</option>
        <!-- services offered by URSB -->
        <option value="pending">Name Reservation</option>
        <option value="active">Business Registration</option>
        <option value="blocked">Company Registration</option>
      </select>

      <!-- drop down of other MDAs -->
      <select class="filter-element w-full text-xs">
        <option :value="null">- NITA</option>
        <!-- services offered by NITA -->
        <option value="pending">e-Government Services</option>
        <option value="active">e-Procurement</option>
        <option value="blocked">e-Visa</option>
      </select>
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
