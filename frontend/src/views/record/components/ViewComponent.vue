<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import {
    BriefcaseIcon,
    FileTextIcon,
    HeartIcon,
    IdIcon,
    MapPinIcon,
    ShieldCheckIcon,
    UserIcon,
} from 'vue-tabler-icons';
import DefaultImage from '@/assets/images/profile/profile.png';
import type { RecordDetail } from '@/interfaces/record.interface';
import DetailField from './DetailField.vue';
import DetailSection from './DetailSection.vue';
import FileViewer from './FileViewer.vue';
import AuthorizedImage from '@/components/shared/AuthorizedImage.vue';

interface NavigationItem {
    id: string;
    title: string;
    icon: Component;
}

const props = defineProps<{
    form: RecordDetail;
    canEdit?: boolean;
    reviewMode?: boolean;
}>();

const emit = defineEmits<{
    close: [];
    edit: [];
}>();

const showSensitiveDetails = ref(false);
const isDocumentVisible = ref(false);
const currentDocumentUrl = ref('');
const activeSection = ref('personal');
const profileImage = ref(props.form.profileImage || DefaultImage);

const navigationItems: NavigationItem[] = [
    { id: 'personal', title: 'Personal', icon: UserIcon },
    { id: 'identity', title: 'Identity', icon: IdIcon },
    { id: 'occupation', title: 'Occupation & Addresses', icon: BriefcaseIcon },
    { id: 'family', title: 'Family', icon: HeartIcon },
    { id: 'policies', title: 'Policies', icon: ShieldCheckIcon },
    { id: 'documents', title: 'Documents', icon: FileTextIcon },
];

const fullName = computed(() => `${props.form.firstName || ''} ${props.form.lastName || ''}`.trim() || 'Unnamed record');
const statusColor = computed(() => props.form.status === 'COMPLETED' ? 'success' : 'warning');
const statusLabel = computed(() => props.form.status === 'COMPLETED' ? 'Completed' : 'Draft');

const displaySensitiveValue = (value?: string) => {
    if (!value) return '—';
    if (showSensitiveDetails.value) return value;

    const visibleCharacters = value.slice(-4);
    return `${'•'.repeat(Math.max(value.length - 4, 4))} ${visibleCharacters}`;
};

const scrollToSection = (sectionId: string) => {
    activeSection.value = sectionId;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const viewDocument = (file: string) => {
    currentDocumentUrl.value = file;
    isDocumentVisible.value = true;
};

const useDefaultProfileImage = () => {
    profileImage.value = DefaultImage;
};
</script>

<template>
    <div class="profile-detail pa-3 pa-md-4" :class="{ 'profile-detail-review': reviewMode }">
        <v-card class="profile-header mb-3">
            <v-card-text class="profile-header__content d-flex flex-column flex-sm-row align-center ga-3">
                <v-avatar size="76">
                    <AuthorizedImage :src="profileImage" alt="Profile image" @error="useDefaultProfileImage" />
                </v-avatar>

                <div class="flex-grow-1 text-center text-sm-left">
                    <div class="d-flex flex-wrap align-center justify-center justify-sm-start ga-2">
                        <h1 class="profile-header__name">{{ fullName }}</h1>
                        <v-chip :color="statusColor" variant="tonal" size="x-small">{{ statusLabel }}</v-chip>
                    </div>
                    <div class="profile-header__record-id">Record ID #{{ form.id || '—' }}</div>
                    <div class="profile-header__contacts mt-1">
                        {{ form.email || 'No email available' }}
                        <span class="mx-2">|</span>
                        {{ form.mobileNumber || 'No mobile number available' }}
                    </div>
                </div>

                <div v-if="!reviewMode" class="d-flex ga-2">
                    <v-tooltip :text="canEdit ? 'Edit this record' : 'Completed records are locked'">
                        <template #activator="{ props: tooltipProps }">
                            <span v-bind="tooltipProps">
                                <v-btn color="secondary" variant="outlined" size="small" :disabled="!canEdit" @click="emit('edit')">
                                    Edit
                                </v-btn>
                            </span>
                        </template>
                    </v-tooltip>
                    <v-btn variant="text" size="small" @click="emit('close')">Close</v-btn>
                </div>
            </v-card-text>
        </v-card>

        <v-slide-group class="d-md-none mb-4" show-arrows>
            <v-slide-group-item v-for="item in navigationItems" :key="item.id">
                <v-chip class="mr-2" color="secondary" variant="outlined" @click="scrollToSection(item.id)">
                    {{ item.title }}
                </v-chip>
            </v-slide-group-item>
        </v-slide-group>

        <v-row class="detail-layout">
            <v-col cols="12" md="3" lg="2" class="sidebar-column d-none d-md-block">
                <v-card class="section-navigation">
                    <v-list nav density="compact">
                        <v-list-item
                            v-for="item in navigationItems"
                            :key="item.id"
                            :title="item.title"
                            color="secondary"
                            :active="activeSection === item.id"
                            rounded="lg"
                            @click="scrollToSection(item.id)"
                        >
                            <template #prepend>
                                <component :is="item.icon" size="20" />
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="12" md="9" lg="10" class="d-flex flex-column ga-3">
                <DetailSection id="personal" title="Personal Details" :icon="UserIcon">
                    <v-row dense>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="First Name" :value="form.firstName" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="Last Name" :value="form.lastName" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="Email" :value="form.email" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="Mobile Number" :value="form.mobileNumber" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="WhatsApp Number" :value="form.whatsappNumber" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="Date of Birth" :value="form.dateOfBirth" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="Gender" :value="form.gender" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="House Name" :value="form.houseName" /></v-col>
                        <v-col cols="12" sm="6" lg="4"><DetailField label="House Number" :value="form.houseNumber" /></v-col>
                    </v-row>
                </DetailSection>

                <DetailSection id="identity" title="Identity Details" :icon="IdIcon">
                    <template #action>
                        <v-btn
                            size="small"
                            variant="text"
                            color="secondary"
                            :prepend-icon="showSensitiveDetails ? '$eyeOff' : '$eye'"
                            @click="showSensitiveDetails = !showSensitiveDetails"
                        >
                            {{ showSensitiveDetails ? 'Hide details' : 'Show details' }}
                        </v-btn>
                    </template>
                    <v-row dense>
                        <v-col cols="12" sm="6"><DetailField label="Aadhaar Number" :value="displaySensitiveValue(form.aadhaarNumber)" /></v-col>
                        <v-col cols="12" sm="6"><DetailField label="Driving License" :value="displaySensitiveValue(form.drivingLicense)" /></v-col>
                        <v-col cols="12" sm="6"><DetailField label="Election ID" :value="displaySensitiveValue(form.electionID)" /></v-col>
                        <v-col cols="12" sm="6"><DetailField label="Passport Number" :value="displaySensitiveValue(form.passportNumber)" /></v-col>
                    </v-row>
                </DetailSection>

                <DetailSection id="occupation" title="Occupation & Addresses" :icon="BriefcaseIcon">
                    <v-row dense class="mb-1">
                        <v-col cols="12" sm="6"><DetailField label="Occupation" :value="form.job" /></v-col>
                        <v-col cols="12" sm="6"><DetailField label="Retirement Date" :value="form.retirementDate" /></v-col>
                    </v-row>
                    <v-row dense v-if="form.addresses?.length">
                        <v-col v-for="(address, index) in form.addresses" :key="address.id || index" cols="12" lg="6">
                            <v-card variant="outlined" class="mini-card">
                                <v-card-title class="d-flex align-center ga-2 mini-card__title">
                                    <MapPinIcon class="text-secondary" size="16" /> Address {{ index + 1 }}
                                </v-card-title>
                                <v-card-text class="pt-1">
                                    <v-row dense>
                                        <v-col cols="12" sm="6"><DetailField label="House" :value="address.houseName" /></v-col>
                                        <v-col cols="12" sm="6"><DetailField label="House Number" :value="address.houseNumber" /></v-col>
                                        <v-col cols="12" sm="6"><DetailField label="Street" :value="address.streetName" /></v-col>
                                        <v-col cols="12" sm="6"><DetailField label="Village" :value="address.village" /></v-col>
                                        <v-col cols="12" sm="6"><DetailField label="Post Office" :value="address.postOffice" /></v-col>
                                        <v-col cols="12" sm="6"><DetailField label="Location Type" :value="address.locationType" /></v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-alert v-else type="info" color="secondary" variant="tonal">No additional addresses available.</v-alert>
                </DetailSection>

                <DetailSection id="family" title="Family Details" :icon="HeartIcon">
                    <v-row dense class="mb-1">
                        <v-col cols="12" sm="6"><DetailField label="Marriage Date" :value="form.marriageDate" /></v-col>
                        <v-col cols="12" sm="6"><DetailField label="Previous Address" :value="form.previousAddress" /></v-col>
                    </v-row>
                    <v-row dense v-if="form.children?.length">
                        <v-col v-for="(child, index) in form.children" :key="child.id || index" cols="12" sm="6" lg="4">
                            <v-card variant="outlined" class="mini-card">
                                <v-card-title class="mini-card__title">Child {{ index + 1 }}</v-card-title>
                                <v-card-text class="d-flex flex-column ga-2 pt-1">
                                    <DetailField label="Name" :value="child.name" />
                                    <DetailField label="Date of Birth" :value="child.dateOfBirth" />
                                    <DetailField label="Gender" :value="child.gender" />
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-alert v-else type="info" color="secondary" variant="tonal">No children available.</v-alert>
                </DetailSection>

                <DetailSection id="policies" title="Policy Details" :icon="ShieldCheckIcon">
                    <v-table v-if="form.policies?.length" density="compact" class="detail-table">
                        <thead><tr><th>Policy Number</th><th>Policy Type</th></tr></thead>
                        <tbody>
                            <tr v-for="(policy, index) in form.policies" :key="policy.id || index">
                                <td>{{ policy.number || '—' }}</td><td>{{ policy.type || '—' }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-alert v-else type="info" color="secondary" variant="tonal">No policies available.</v-alert>
                </DetailSection>

                <DetailSection id="documents" title="Documents" :icon="FileTextIcon">
                    <v-table v-if="form.documents?.length" density="compact" class="detail-table">
                        <thead><tr><th>Document Name</th><th>AI Index</th><th class="text-right">Actions</th></tr></thead>
                        <tbody>
                            <tr v-for="(document, index) in form.documents" :key="document.id || index">
                                <td>{{ document.name || 'Unnamed document' }}</td>
                                <td>
                                    <v-chip size="x-small" color="secondary" variant="tonal">
                                        {{ document.extractionStatus || 'PENDING' }}
                                    </v-chip>
                                </td>
                                <td class="text-right">
                                    <v-btn color="secondary" variant="outlined" size="x-small" @click="viewDocument(document.file)">View</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-alert v-else type="info" color="secondary" variant="tonal">No documents available.</v-alert>
                </DetailSection>
            </v-col>
        </v-row>

        <FileViewer
            :is-visible="isDocumentVisible"
            :file="currentDocumentUrl"
            @update:is-visible="isDocumentVisible = $event"
        />
    </div>
</template>

<style scoped>
.profile-detail {
    min-height: 100%;
    background: #f5f7fb;
}

.profile-detail-review {
    padding: 0 !important;
    background: transparent;
}

.profile-header {
    position: sticky;
    top: 0;
    z-index: 5;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-border-color), 0.12);
    box-shadow: 0 2px 12px rgba(31, 41, 55, 0.06);
}

.profile-header__content {
    min-height: 92px;
    padding: 10px 18px;
}

.profile-header__name {
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.7rem;
}

.profile-header__record-id {
    color: rgb(var(--v-theme-secondary));
    font-size: 0.72rem;
    font-weight: 700;
}

.profile-header__contacts {
    color: rgb(var(--v-theme-lightText));
    font-size: 0.75rem;
}

.detail-layout {
    margin-left: 0;
    margin-right: 0;
}

.section-navigation {
    position: sticky;
    top: 108px;
    border: 0;
    box-shadow: none;
}

.sidebar-column {
    align-self: stretch;
    margin-top: 12px;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-border-color), 0.12);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(31, 41, 55, 0.04);
}

.mini-card {
    height: 100%;
    background: rgb(var(--v-theme-surface));
}

.mini-card__title {
    padding: 10px 12px 4px;
    font-size: 0.78rem;
    font-weight: 600;
}

.detail-table {
    border: 1px solid rgba(var(--v-border-color), 0.1);
    border-radius: 8px;
}

.detail-table :deep(th),
.detail-table :deep(td) {
    height: 32px !important;
    font-size: 0.72rem !important;
}

@media (max-width: 599px) {
    .profile-header__content {
        padding: 14px;
    }

    .profile-header__contacts span {
        display: none;
    }
}
</style>
