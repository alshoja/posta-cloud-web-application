<template>
  <div class="logo">
    <RouterLink to="/">
      <img width="100%" :src="DefaultImage" alt="logo" />
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import DefaultImage from '@/assets/images/logos/logo-pc.png';

const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
</script>
