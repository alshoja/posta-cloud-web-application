<script setup lang="ts">
import { useLoaderStore } from '@/stores/loader.store';
import { computed } from 'vue';

const loaderStore = useLoaderStore();
const isLoading = computed(() => loaderStore.isLoading);
</script>

<!-- <template>
  <div v-if="isLoading">
    <v-progress-linear buffer-value="0" color="red-lighten-2" stream></v-progress-linear>
  </div>
</template> -->


<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>


<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #470834;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
