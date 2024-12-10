  <script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { useServicesStore } from "@/domain/services/stores";
import type { Service } from "@/domain/services/types";
import { useProviderStore } from "@/domain/entities/stores";
import { useNotificationsStore } from "@/stores/notifications";

const store = useServicesStore();
const notify = useNotificationsStore();

const providerStore = useProviderStore();

const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(16);
const loading: Ref<boolean> = ref(false);
const selectedService: Ref<string> = ref("");
let providerId = ref("");
let status = ref("");

const services: Ref<any[]> = ref([]); // Will be passed as a prop
const subscribe = (serviceId: string) => {
  // Add subscription logic or emit an event
};

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
onMounted(() => {
  store.fetchServices();
//   store.fetchSubscribedServices();
});
</script>
  

<template>
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
          <img :src="service.thumbnail" alt="" class="w-10 h-10 object-cover" />
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
</template>
