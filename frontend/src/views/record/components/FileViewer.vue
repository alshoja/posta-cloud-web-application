<template>
    <v-dialog v-model="localIsVisible" max-width="600px">
        <v-card>
            <v-card-title class="d-flex align-center justify-between">
                <v-row class="no-gutters">
                    <v-col class="d-flex align-center">
                        <h4 variant="h6" class="font-weight-bold" color="primary">
                            File Viewer
                        </h4>
                    </v-col>
                </v-row>

                <!-- Close Button with Icon -->
                <v-btn icon @click="closeModal" class="rounded-circle">
                    <ChevronDownIcon stroke-width="1.5" width="20" class="text-error" />
                </v-btn>
            </v-card-title>

            <v-card-text>
                <!-- Image view -->
                <v-img v-if="imageUrl" :src="imageUrl" aspect-ratio="1.5" />

                <!-- PDF view -->
                <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="500px"></iframe>

                <!-- Text file view -->
                <pre v-if="fileContent" class="modal-text">{{ fileContent }}</pre>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDownIcon } from 'vue-tabler-icons';

interface Props {
    isVisible: boolean;
    file: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:isVisible']);
const localIsVisible = ref(props.isVisible);

const imageUrl = ref<string | null>(null);
const pdfUrl = ref<string | null>(null);
const fileContent = ref<string | null>(null);
const closeModal = () => {
    localIsVisible.value = false;
};

const handleFileUpload = (file: string) => {
    const fileType = file.split('.').pop();
    console.log("🚀 ~ handleFileUpload ~ fileType:", fileType)
    if (file) {
        if (fileType === 'jpeg' || fileType === 'jpg' || fileType === 'png') {
            imageUrl.value = file;
            pdfUrl.value = null;
            fileContent.value = null;
        } else if (fileType === 'pdf') {
            pdfUrl.value = file;
            imageUrl.value = null;
            fileContent.value = null;
        } else if (fileType === 'txt') {
            fileContent.value = `File URL: ${file}`;
            imageUrl.value = null;
            pdfUrl.value = null;
        } else {
            // Handle unsupported file types
            alert('File type not supported');
        }
    }
};

watch(() => props.file, handleFileUpload, { immediate: true });

watch(localIsVisible, (newVal) => {
    emit('update:isVisible', newVal);
});

watch(() => props.isVisible, (newVal) => {
    localIsVisible.value = newVal;
});

watch(() => props.file, handleFileUpload, { immediate: true });
</script>

<style scoped>
.modal-text {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
    white-space: pre-line;
}
</style>
