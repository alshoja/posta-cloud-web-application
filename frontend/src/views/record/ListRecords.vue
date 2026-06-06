<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type { RecordDetail, RecordStatus } from '@/interfaces/record.interface';
import { useAuthStore } from '@/stores/auth';
import { useRecordStore } from '@/stores/record';
import { useSnackbarStore } from '@/stores/snackbar.store';
import ViewComponent from '@/views/record/components/ViewComponent.vue';
import _ from "lodash";
import { computed, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { EditIcon, RefreshIcon, SearchIcon, TrashIcon, ViewfinderIcon } from 'vue-tabler-icons';

const page = ref({ title: 'Records Overview' });
const breadcrumbs = shallowRef([
    { title: 'Records', disabled: false, href: '#' },
    { title: 'All Records', disabled: true, href: '#' }
]);


const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref<number>(-1);
const search = ref<string | undefined>(undefined);
const statusFilter = ref<RecordStatus | 'ALL'>('ALL');
const serverItem = ref<RecordDetail>();
const serverItems = ref<RecordDetail[]>();
const totalItems = ref(0);
const itemsPerPage = ref(10);
const statusOptions = [
    { title: 'All', value: 'ALL' },
    { title: 'Draft', value: 'DRAFT' },
    { title: 'Completed', value: 'COMPLETED' },
];

const router = useRouter();

const recordStore = useRecordStore();
const authStore = useAuthStore();
const snackbar = useSnackbarStore()
const isAdminUser = authStore.user?.role === 'ADMIN';
const currentUserId = authStore.user?.id;
const headers = computed(() => [
    { title: 'Record ID', key: 'id' },
    { title: 'First Name', sortable: false, key: 'firstName' },
    { title: 'Email', key: 'email' },
    { title: 'Mobile', key: 'mobileNumber', },
    { title: 'Gender', key: 'gender', },
    ...(isAdminUser ? [{ title: 'Added By', key: 'addedBy' }] : []),
    { title: 'Entry Date', key: 'createdAt', },
    { title: 'Status', key: 'status' },
    { title: 'Actions', sortable: false, key: 'actions' },
]);

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

const editDialogItem = () => {
    if (!serverItem.value || !canEditRecord(serverItem.value)) return;
    dialog.value = false;
    editItem(serverItem.value);
};

const canEditRecord = (item: RecordDetail) => item.status !== 'COMPLETED';
const canDeleteRecord = (item: RecordDetail) => item.user?.id === currentUserId;
const canReopenRecord = (item: RecordDetail) => isAdminUser && item.status === 'COMPLETED';
const getEditHint = (item: RecordDetail) =>
    item.status === 'COMPLETED'
        ? 'Completed records are locked. Only admins can reopen them.'
        : 'Open this draft to continue editing.';
const getDeleteHint = (item: RecordDetail) =>
    canDeleteRecord(item)
        ? 'Delete your own record.'
        : 'You can only delete records you created.';
const getReopenHint = (item: RecordDetail) =>
    canReopenRecord(item)
        ? 'Reopen this completed record as a draft.'
        : 'Only admins can reopen completed records.';

const reopenItem = async (item: RecordDetail) => {
    if (!item.id) return;

    try {
        await recordStore.reopen(item.id);
        await loadRecords({
            page: 1,
            itemsPerPage: itemsPerPage.value,
            sortBy: [],
            searchQuery: search.value || '',
            status: statusFilter.value,
        });
        snackbar.showSnackbar('Record reopened successfully.', 'success', []);
    } catch (error) {
        console.error('Failed to reopen record:', error);
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Unable to reopen record.';
        snackbar.showSnackbar(errorMessage, 'error', []);
    }
};

const loadRecords = async ({ page, itemsPerPage, sortBy, searchQuery, status = statusFilter.value }: { page: number, itemsPerPage: number, sortBy: { key: string, order: string }[], searchQuery: string, status?: RecordStatus | 'ALL' }) => {
    await recordStore.fetchAllRecords({
        page: page,
        limit: itemsPerPage,
        sortBy: sortBy.length ? sortBy[0].key : undefined,
        sortOrder: sortBy.length ? sortBy[0].order : undefined,
        search: searchQuery,
        status
    });
    serverItems.value = recordStore.records.data;
    totalItems.value = recordStore.records.total;
};

const openDialog = (record: RecordDetail) => {
    if (serverItems.value) {
        serverItem.value = serverItems.value.find((item) => item.id === record.id);
        dialog.value = true;
    }
};

const formatStatus = (status?: string) => {
    if (!status) return '';
    return status
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const statusColor = (status?: string) => {
    if (status === 'DRAFT') return 'warning';
    if (status === 'COMPLETED') return 'success';
    return 'grey';
};

const getAddedBy = (item: RecordDetail) => {
    const firstName = item.user?.firstName?.trim() || '';
    const lastName = item.user?.lastName?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || item.user?.email || '-';
};

watch(
    () => dialogDelete.value, (val) => {
        if (!val) closeDelete();
    }
);

watch([search, statusFilter], ([newSearch, newStatus]) => {
    debouncedLoadRecords({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        searchQuery: newSearch,
        status: newStatus,
    });
});

</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
    
    <UiParentCard title="All Records">
        <v-row class="records-toolbar-row align-center">
            <v-col cols="12" md="4" lg="3">
                <v-text-field
                    menu-icon=""
                    label="Search records"
                    placeholder="Name, email, or mobile"
                    v-model="search"
                    variant="outlined"
                    hide-details
                >
                    <template v-slot:prepend-inner>
                        <SearchIcon stroke-width="1.5" size="20" class="text-lightText SearchIcon" />
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="3" lg="2">
                <v-select
                    v-model="statusFilter"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    hide-details
                />
            </v-col>
        </v-row>
     
        <div class="records-table-wrapper">
           
            <v-data-table-server v-if="headers.length" v-model:items-per-page="itemsPerPage" :headers="headers"
                :items="serverItems" :items-length="totalItems" :loading="false" @update:options="loadRecords">
                <template v-slot:item="{ item }">
                    <tr>
                        <td class="text-secondary font-weight-medium">{{ item.id || '—' }}</td>
                        <td @click="openDialog(item)" style="cursor: pointer; ">
                            <span color="secondary"> {{ item.firstName }}</span>
                        </td>
                        <td>{{ item.email }}</td>
                        <td>{{ item.mobileNumber }}</td>
                        <td>{{ item.gender }}</td>
                        <td v-if="isAdminUser">{{ getAddedBy(item) }}</td>
                        <td>{{ item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '' }}</td>
                        <td>
                            <v-chip size="small" variant="tonal" :color="statusColor(item.status)">
                                {{ formatStatus(item.status) }}
                            </v-chip>
                        </td>
                        <td class="actions-cell">
                            <div class="actions-group">
                                <v-tooltip text="View record details">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" @click="openDialog(item)" variant="outlined" size="small" color="secondary">
                                            <ViewfinderIcon class="icon" />
                                        </v-btn>
                                    </template>
                                </v-tooltip>

                                <v-tooltip :text="getEditHint(item)">
                                    <template v-slot:activator="{ props }">
                                        <span v-bind="props" class="d-inline-block">
                                            <v-btn variant="outlined" size="small" color="secondary" @click="editItem(item)"
                                                :disabled="!canEditRecord(item)">
                                                <EditIcon class="icon" />
                                            </v-btn>
                                        </span>
                                    </template>
                                </v-tooltip>

                                <v-tooltip v-if="isAdminUser" :text="getReopenHint(item)">
                                    <template v-slot:activator="{ props }">
                                        <span v-bind="props" class="d-inline-block">
                                            <v-btn variant="outlined" size="small" color="primary" @click="reopenItem(item)"
                                                :disabled="!canReopenRecord(item)">
                                                <RefreshIcon class="icon" />
                                            </v-btn>
                                        </span>
                                    </template>
                                </v-tooltip>

                                <v-tooltip :text="getDeleteHint(item)">
                                    <template v-slot:activator="{ props }">
                                        <span v-bind="props" class="d-inline-block">
                                            <v-btn variant="outlined" size="small" color="error" @click="deleteItem(item)" :disabled="!canDeleteRecord(item)">
                                                <TrashIcon class="icon" />
                                            </v-btn>
                                        </span>
                                    </template>
                                </v-tooltip>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table-server>
         
        </div>
    </UiParentCard>

    <div class="text-center pa-4">
        <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
            <v-card v-if="serverItem" class="detail-dialog">
                <ViewComponent
                    :form="serverItem"
                    :can-edit="canEditRecord(serverItem)"
                    @close="dialog = false"
                    @edit="editDialogItem"
                />
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

<style scoped>
.records-toolbar-row {
    row-gap: 0;
}

.records-info-alert {
    margin-top: 0;
}

.records-table-wrapper {
    position: relative;
}

.actions-cell {
    min-width: 220px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.actions-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
}

.detail-dialog {
    overflow-y: auto;
}
</style>
