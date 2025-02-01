<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type { RecordDetail } from '@/interfaces/record.interface';
import { useRecordStore } from '@/stores/record';
import { useSnackbarStore } from '@/stores/snackbar.store';
import ViewComponent from '@/views/record/components/ViewComponent.vue';
import _ from "lodash";
import { ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { EditIcon, SearchIcon, TrashIcon, ViewfinderIcon } from 'vue-tabler-icons';

const page = ref({ title: 'Records Overview' });
const breadcrumbs = shallowRef([
    { title: 'Records', disabled: false, href: '#' },
    { title: 'All Records', disabled: true, href: '#' }
]);

const headers = ref([
    { title: 'First Name', sortable: false, key: 'firstName' },
    { title: 'Last Name', key: 'lastName', },
    { title: 'Email', key: 'email' },
    { title: 'Mobile', key: 'mobileNumber', },
    { title: 'Gender', key: 'gender', },
    { title: 'Street Name', key: 'panchayat', },
    { title: 'Entry Date', key: 'createdAt', },
]);

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref<number>(-1);
const loading = ref(true);
const search = ref<string | undefined>(undefined);
const serverItem = ref<RecordDetail>();
const serverItems = ref<RecordDetail[]>();
const totalItems = ref(0);
const itemsPerPage = ref(10);

const router = useRouter();

const recordStore = useRecordStore();
const snackbar = useSnackbarStore()

const closeDelete = () => {
    dialogDelete.value = false;
};

const debouncedLoadRecords = _.debounce((options) => loadRecords(options), 300);

const deleteItem = (item: RecordDetail) => {
    if (serverItems.value) {
        editedIndex.value = serverItems.value.indexOf(item);
        dialogDelete.value = true;
    }
};

const deleteItemConfirm = async () => {
    if (serverItems.value) {
        const itemToDelete = serverItems.value[editedIndex.value];

        if (itemToDelete?.id) {
            try {
                await recordStore.remove(itemToDelete.id);
                serverItems.value.splice(editedIndex.value, 1);
                closeDelete();
            } catch (error) {
                console.error("Failed to delete item remotely:", error);
                const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred';
                snackbar.showSnackbar(errorMessage, 'error', []);
            }
        }
    }
};

const editItem = (item: RecordDetail) => {
    router.push({ name: 'Edit Record', params: { recordId: item.id } });
};

const loadRecords = async ({ page, itemsPerPage, sortBy, searchQuery }: { page: number, itemsPerPage: number, sortBy: { key: string, order: string }[], searchQuery: string }) => {
    loading.value = true;
    await recordStore.fetchAllRecords({
        page: page,
        limit: itemsPerPage,
        sortBy: sortBy.length ? sortBy[0].key : undefined,
        sortOrder: sortBy.length ? sortBy[0].order : undefined,
        search: searchQuery
    });
    serverItems.value = recordStore.records.data;
    loading.value = false;
    totalItems.value = recordStore.records.total;
};

const openDialog = (record: RecordDetail) => {
    if (serverItems.value) {
        serverItem.value = serverItems.value.find((item) => item.id === record.id);
        dialog.value = true;
    }
};

watch(
    () => dialogDelete.value, (val) => {
        if (!val) closeDelete();
    }
);

watch(search, (newSearch) => {
    debouncedLoadRecords({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        searchQuery: newSearch,
    });
});

</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

    <UiParentCard title="All Records">
        <v-row>
            <v-col cols="12" md="3">
                <v-text-field menu-icon="" label="Search Record" v-model="search" variant="outlined">
                    <template v-slot:prepend-inner>
                        <SearchIcon stroke-width="1.5" size="20" class="text-lightText SearchIcon" />
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-data-table-server v-if="headers.length" v-model:items-per-page="itemsPerPage" :headers="headers"
            :items="serverItems" :items-length="totalItems" :loading="loading" @update:options="loadRecords">
            <template v-slot:item="{ item }">
                <tr>
                    <td @click="openDialog(item)" style="cursor: pointer; ">
                        <span color="secondary"> {{ item.firstName }}</span>
                    </td>
                    <td>{{ item.lastName }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.mobileNumber }}</td>
                    <td>{{ item.gender }}</td>
                    <td>{{ item.panchayat }}</td>
                    <td>{{ item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '' }}</td>
                    <td>
                        <v-btn @click="openDialog(item)" variant="outlined" size="small" color="secondary">
                            <ViewfinderIcon class="icon" />
                        </v-btn>
                        &nbsp;

                        <v-btn variant="outlined" size="small" color="secondary" @click="editItem(item)">
                            <EditIcon class="icon" />
                        </v-btn>
                        &nbsp;
                        <v-btn variant="outlined" size="small" color="error" @click="deleteItem(item)">
                            <TrashIcon class="icon" />
                        </v-btn>

                    </td>
                </tr>
            </template>
        </v-data-table-server>
    </UiParentCard>

    <div class="text-center pa-4">
        <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
            <v-card v-if="serverItem">
                <v-toolbar>
                    <v-toolbar-title>{{ serverItem.firstName }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="dialog = false">Close</v-btn>
                </v-toolbar>
                <ViewComponent class="pa-3" :form="serverItem" />
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
                <v-card-title class="text-h5 text-center pa-3">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions class="justify-center">
                    <v-btn variant="outlined" size="small" color="primary" @click="closeDelete"
                        class="ma-1">Cancel</v-btn>
                    <v-btn variant="outlined" size="small" color="error" @click="deleteItemConfirm"
                        class="ma-1">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
