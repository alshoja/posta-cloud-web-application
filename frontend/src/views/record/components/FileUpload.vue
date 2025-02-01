<template>
    <v-file-input :variant="'outlined'" :label="'Upload Profile Image'" :accept=accept v-model="file" :rules="rules"
        @change="handleFileChange" :dense="true" :hide-details="true" :outlined="true" />
    <v-progress-linear v-if="loading" indeterminate color="secondary" size="40" width="4"></v-progress-linear>
</template>

<script lang="ts" setup>
import { useFileStore } from '@/stores/file.store';
import { defineEmits, defineProps, ref } from 'vue';

defineProps({
    rules: {
        type: Array as () => ((value: any) => boolean | string)[],
        default: () => [],
    },
    label: {
        type: String,
        default: 'Upload File',
    },
    accept: {
        type: String,
        default: '*/*',
    },
});
const fileStore = useFileStore();
const emit = defineEmits<{
    (event: 'uploaded', url: string): void;
}>();

const file = ref<File | null>(null);
const loading = ref(false);

const handleFileChange = () => {
    if (file.value) {
        uploadFile();
    }
};

const uploadFile = async () => {
    if (!file.value) return;

    loading.value = true;
    const formData = new FormData();
    formData.append('file', file.value);

    try {

        await fileStore.uploadFile(formData);
        const fileUrl = fileStore.fileUrl;
        emit('uploaded', fileUrl);
    } catch (error) {
        console.error('Upload failed:', error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.v-progress-circular {
    margin-top: 10px;
}
</style>