 
  <script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";

const subscribedServices: Ref<any[]> = ref([]); // Will be passed as a prop
const unsubscribe = (serviceId: string) => {
  // Add unsubscribe logic or emit an event
};
const open = (service: any) => {
  // Add navigation logic to open service details
};
</script>
  
  
  <template>
  <!-- <div class="flex flex-col justify-between mt-3 text-left"> -->
  <div>
    <div
      v-for="(subscribedService, id) in subscribedServices"
      :key="id"
      class="list-none flex justify-between mx-3"
    >
      <span
        class="hover:underline cursor-pointer font-semibold text-gray-700"
        @click="open(subscribedService)"
      >
        {{ subscribedService.name }}
      </span>

      <!-- Unsubscribe button -->
      <button
        class="text-xs rounded-md p-1 font-semibold text-black-600 bg-gray-100 border border-gray-200 hover:text-red-700 hover:bg-red-300"
        @click="unsubscribe(subscribedService.id)"
      >
        Unsubscribe
      </button>
    </div>
  </div>
</template>
 