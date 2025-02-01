<template>
    <v-col cols="12" md="12">
        <div class="d-flex flex-column align-center justify-center">
            <v-avatar v-if="url" :image="url" size="100"></v-avatar>
            <v-avatar v-if="!url" size="100">
                <img width="100%" :src="DefaultImage" alt="avatar" />
            </v-avatar>
        </div>
    </v-col>
</template>

<script setup lang="ts">
import DefaultImage from '@/assets/images/profile/profile.png';

defineProps({
    url: {
        type: String,
        required: false,
        default: null
    },
})

</script>

<style scoped></style>