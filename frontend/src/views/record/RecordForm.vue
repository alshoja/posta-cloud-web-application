<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import axiosInstance from '@/axiosInstance.interceptor';
import DropdownButton from '@/components/shared/DropdownButton.vue';
import { useForm } from '@/composables/useForm';
import { useValidation } from '@/composables/useValidation';
import type { RecordDetail, RecordStatus } from '@/interfaces/record.interface';
import { useFileStore } from '@/stores/file.store';
import { useRecordStore } from '@/stores/record';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import AddressFields from '@/views/record/components/AddressFields.vue';
import FileUpload from '@/views/record/components/FileUpload.vue';
import FileViewer from '@/views/record/components/FileViewer.vue';
import ProfileImage from '@/views/record/components/ProfileImage.vue';
import ViewComponent from '@/views/record/components/ViewComponent.vue';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BriefcaseIcon, CameraIcon, CheckIcon, HeartIcon, HomeIcon, IdIcon, MapPinIcon, PhoneIcon, PlusIcon, ShieldCheckIcon, TrashIcon, UserIcon, UsersIcon } from 'vue-tabler-icons';

const route = useRoute()
const loading = ref(false);
const snackbar = useSnackbarStore();
const router = useRouter()
const validationRules = useValidation();
const identityDocumentTypes = ['Passport', 'National ID', "Driver's License", 'Voter/Election Card', 'Other'];
const financialAccountTypes = ['Bank Account', 'Insurance Policy', 'Government ID Linked Account', 'Other'];
const mobileNumberInvalid = ref(false);
const whatsappNumberInvalid = ref(false);
const onMobileNumberValidate = (phoneObject: { valid?: boolean; number?: string }) => {
    mobileNumberInvalid.value = Boolean(phoneObject.number) && !phoneObject.valid;
};
const onWhatsappNumberValidate = (phoneObject: { valid?: boolean; number?: string }) => {
    whatsappNumberInvalid.value = Boolean(phoneObject.number) && !phoneObject.valid;
};
const recordStore = useRecordStore();
const fileStore = useFileStore();
const {
    stepOneInitialState,
    stepTwoInitialState,
    stepThreeInitialState,
    stepFourInitialState,
    stepFiveInitialState,
    stepSixInitialState
} = useForm();

const page = computed(() => ({
    title: stepper.edit ? 'Edit Record' : 'Create Record'
}));
const breadcrumbs = computed(() => ([
    { title: 'Records', disabled: false, href: '#' },
    { title: page.value.title, disabled: true, href: '#' }
]));
const stepper = reactive({
    step: 1,
    edit: false,
    show1: false,
    show2: true,
    items: ['Personal Details', 'Sensitive Details', 'Occupation & Address', 'Family Details', 'Financial Accounts', 'Documents', 'Review & Submit'],
});
const stepOne = reactive({ ...stepOneInitialState });
const stepTwo = reactive({ ...stepTwoInitialState });
const stepThree = reactive({ ...stepThreeInitialState });
const stepFour = reactive({ ...stepFourInitialState });
const stepFive = reactive({ ...stepFiveInitialState });
const stepSix = reactive({ ...stepSixInitialState });
const whatsappSameAsMobile = ref(false);
const onToggleWhatsappSameAsMobile = (value: boolean | null) => {
    if (value) {
        stepOne.whatsappNumber = stepOne.mobileNumber;
    }
};
watch(() => stepOne.mobileNumber, (mobile) => {
    if (whatsappSameAsMobile.value) {
        stepOne.whatsappNumber = mobile;
    }
});
const isModalVisible = ref(false);
const currentDocumentUrl = ref<string>('');

const MAX_FORM_STEP = 7;

const normalizeStep = (value: unknown): number => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 1;
    const floored = Math.floor(parsed);
    return Math.min(Math.max(floored, 1), MAX_FORM_STEP);
};

const resolveInitialStep = (record: RecordDetail, recordId: string): number => {
    const queryStep = route.query.step;
    if (queryStep !== undefined) {
        const raw = Array.isArray(queryStep) ? queryStep[0] : queryStep;
        return normalizeStep(raw);
    }

    const rememberedStep = recordStore.getCurrentStep(recordId);
    if (rememberedStep) {
        return normalizeStep(rememberedStep);
    }

    const lastCompletedStep = Number(record.lastCompletedStep ?? 0);
    if (Number.isFinite(lastCompletedStep) && lastCompletedStep > 0) {
        return normalizeStep(lastCompletedStep + 1);
    }

    return 1;
};

const syncStepState = async () => {
    const recordIdParam = route.params.recordId;
    const recordId = Array.isArray(recordIdParam) ? recordIdParam[0] : recordIdParam;
    if (!recordId) return;

    recordStore.setCurrentStep(recordId, stepper.step);

    const currentQueryStep = Array.isArray(route.query.step) ? route.query.step[0] : route.query.step;
    if (String(currentQueryStep ?? '') !== String(stepper.step)) {
        await router.replace({
            query: {
                ...route.query,
                step: String(stepper.step),
            },
        });
    }
};


const addAddress = () => {
    stepThree.addresses.push({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        locationType: '',
    });
};

const removeAddress = (index: number) => {
    stepThree.addresses.splice(index, 1);
};

const addChild = () => {
    if (!stepFour.children) stepFour.children = [];
    stepFour.children.push({
        name: '',
        dateOfBirth: '',
        gender: '',
    });
};

const removeChild = (index: number) => {
    if (stepFour.children) {
        stepFour.children.splice(index, 1);
    }
};

const DOCUMENT_MAX_SIZE_MB = 2;

const addBlankDocument = () => {
    stepSix.documents.push({
        name: '',
        file: ''
    });
};

const removeDocument = (index: number) => {
    stepSix.documents.splice(index, 1);
};

const completedDocumentCount = computed(() =>
    stepSix.documents.filter((document) => document.file).length
);

const incompleteDocumentCount = computed(() =>
    stepSix.documents.filter((document) => !document.file).length
);

const documentProgressPercent = computed(() => {
    if (!stepSix.documents.length) return 100;
    return (completedDocumentCount.value / stepSix.documents.length) * 100;
});

const DOCUMENT_BADGES: Record<string, { label: string; color: string }> = {
    pdf: { label: 'PDF', color: 'red' },
    jpg: { label: 'JPG', color: 'blue' },
    jpeg: { label: 'JPG', color: 'blue' },
    png: { label: 'PNG', color: 'blue' },
    doc: { label: 'DOC', color: 'indigo' },
    docx: { label: 'DOC', color: 'indigo' },
};

const getDocumentBadge = (document: { name: string; file: string }) => {
    const source = document.name || document.file || '';
    const extension = source.split('?')[0].split('.').pop()?.toLowerCase() || '';
    return DOCUMENT_BADGES[extension] || { label: '—', color: 'grey' };
};

const bulkFileInputRef = ref<HTMLInputElement | null>(null);
const rowFileInputRef = ref<HTMLInputElement | null>(null);
const rowUploadTargetIndex = ref<number | null>(null);

const triggerBulkFilePicker = () => {
    bulkFileInputRef.value?.click();
};

const triggerRowFilePicker = (index: number) => {
    rowUploadTargetIndex.value = index;
    rowFileInputRef.value?.click();
};

const uploadFileForDocument = async (file: File, index: number) => {
    if (file.size > DOCUMENT_MAX_SIZE_MB * 1024 * 1024) {
        snackbar.showSnackbar(
            `"${file.name}" is too large. Maximum file size is ${DOCUMENT_MAX_SIZE_MB} MB.`,
            'warning',
            []
        );
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const uploadPath = `/records/${route.params.recordId}/documents/upload`;

    try {
        await fileStore.uploadFile(formData, uploadPath);
        setUploadUrlForDoc(fileStore.fileUrl, file.name, index);
    } catch {
        snackbar.showSnackbar(`Failed to upload "${file.name}".`, 'error', []);
    }
};

const addAndUploadDocuments = async (files: File[]) => {
    for (const file of files) {
        stepSix.documents.push({ name: '', file: '' });
        const index = stepSix.documents.length - 1;
        await uploadFileForDocument(file, index);
    }
};

const handleBulkFileInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (files.length) void addAndUploadDocuments(files);
    input.value = '';
};

const handleBulkDrop = (event: DragEvent) => {
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length) void addAndUploadDocuments(files);
};

const handleRowFileInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && rowUploadTargetIndex.value !== null) {
        void uploadFileForDocument(file, rowUploadTargetIndex.value);
    }
    input.value = '';
};

watchEffect(() => {
    stepSix.valid = stepSix.documents.every((document) => Boolean(document.file) && Boolean(document.name?.trim()));
});

const addFinancialAccount = () => {
    stepFive.financialAccounts.push({
        type: '',
        number: '',
    });
};

const removeFinancialAccount = (index: number) => {
    if (stepFive.financialAccounts.length === 1) {
        stepFive.financialAccounts[0] = {
            type: '',
            number: '',
        };
        return;
    }
    stepFive.financialAccounts.splice(index, 1);
}

const addIdentityDocument = () => {
    stepTwo.identityDocuments.push({
        type: '',
        number: '',
    });
};

const removeIdentityDocument = (index: number) => {
    if (stepTwo.identityDocuments.length === 1) {
        stepTwo.identityDocuments[0] = {
            type: '',
            number: '',
        };
        return;
    }
    stepTwo.identityDocuments.splice(index, 1);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetForm = (form: any, initialState: object) => Object.assign(form, initialState);
watch(
    () => route.params.recordId,
    async (ids) => {
        stepper.edit = Boolean(ids);

        if (ids) {
            const id = Array.isArray(ids) ? ids[0] : ids;
            let record = recordStore.records?.data?.find((r) => r.id === id);

            try {
                if (!record) {
                    await recordStore.fetchRecordById(id);
                    record = recordStore.record;
                }
                setFormFields(record);
                stepper.step = resolveInitialStep(record, id);
                await syncStepState();
            } catch (error) {
                if ((error as { status: number }).status === 404) {
                    router.push({ name: "NotFound" });
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            }
        } else {
            resetForm(stepOne, stepOneInitialState);
            stepper.step = 1;
        }
    },
    { immediate: true }
);

watch(
    () => stepper.step,
    async () => {
        await syncStepState();
    }
);


const setFormFields = (record: RecordDetail) => {
    // Assign only each step's own fields — Object.assign(step, record) for every
    // step would copy every array (addresses/children/financialAccounts/documents)
    // onto all six step objects, and whichever step happened to be spread last when
    // building the Review form would silently overwrite the others' live edits with
    // its stale, load-time snapshot of that same array.
    Object.assign(stepOne, {
        id: record.id,
        profileImage: record.profileImage,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        dateOfBirth: record.dateOfBirth,
        gender: record.gender,
        mobileNumber: record.mobileNumber,
        whatsappNumber: record.whatsappNumber,
        addressLine1: record.addressLine1,
        addressLine2: record.addressLine2,
        city: record.city,
        state: record.state,
        postalCode: record.postalCode,
        country: record.country,
        status: record.status,
    });
    Object.assign(stepTwo, {
        identityDocuments: record.identityDocuments,
        status: record.status,
    });
    Object.assign(stepThree, {
        job: record.job,
        retirementDate: record.retirementDate,
        redirectionAddress: record.redirectionAddress,
        isAbroad: record.isAbroad,
        isRedirected: record.isRedirected,
        redirectedAddressLine1: record.redirectedAddressLine1,
        redirectedAddressLine2: record.redirectedAddressLine2,
        addresses: record.addresses,
        status: record.status,
    });
    Object.assign(stepFour, {
        marriageDate: record.marriageDate,
        previousAddress: record.previousAddress,
        children: record.children,
        status: record.status,
    });
    Object.assign(stepFive, {
        financialAccounts: record.financialAccounts,
        status: record.status,
    });
    Object.assign(stepSix, {
        documents: record.documents,
        status: record.status,
    });

    if (!stepFive.financialAccounts?.length) {
        stepFive.financialAccounts = [{
            type: '',
            number: '',
        }];
    }

    if (!stepTwo.identityDocuments?.length) {
        stepTwo.identityDocuments = [{
            type: '',
            number: '',
        }];
    }
};

const isCurrentStepValid = computed(() => {
    if (stepper.step === 1) return stepOne.valid;
    if (stepper.step === 2) return stepTwo.valid;
    if (stepper.step === 3) return stepThree.valid;
    if (stepper.step === 4) return stepFour.valid;
    if (stepper.step === 5) return stepFive.valid;
    if (stepper.step === 6) return stepSix.valid;
    return false;
});

// const allStepsValid = computed(() => stepOne.valid && stepTwo.valid && stepThree.valid && stepFour.valid && stepFive.valid && stepSix.valid);

const submitStepper = () => {
    submitFinalData();
};

const continueNextStep = () => {
    if (isCurrentStepValid.value) stepper.step++;
}

const previousStep = () => {
    if (stepper.step > 1) stepper.step--;
};

// const gotToStep = (step: number) => (stepper.step = step);

const submitStepData = async (status: RecordStatus = 'DRAFT', shouldContinue = true) => {
    const recordId = route.params.recordId as string || '';
    type StepHandler = {
        method: () => Promise<unknown>;
        successMessage: string;
        onSuccess?: (res: { id: string }) => void;
    };

    const stepsHandler: { [key: number]: StepHandler } = {
        1: {
            method: async () => {
                stepOne.id = recordId;
                return await recordStore.createPersonalData(stepOne, status);
            },
            successMessage: 'Personal Data updated successfully',
            onSuccess: (res: { id: string }) => {
                if (!shouldContinue) {
                    return;
                }
                if (stepper.edit) {
                    continueNextStep();
                } else {
                    router.push({ name: 'Edit Record', params: { recordId: res.id }, query: { step: '2' } });
                    continueNextStep();
                }
            }
        },
        2: {
            method: () => recordStore.createIdentificationData(stepTwo, recordId, status),
            successMessage: 'Identification Data submitted successfully',
        },
        3: {
            method: () => recordStore.createOccupationData(stepThree, recordId, status),
            successMessage: 'Occupation Data submitted successfully',
        },
        4: {
            method: () => recordStore.createFamilyData(stepFour, recordId, status),
            successMessage: 'Family Data submitted successfully',
        },
        5: {
            method: () => recordStore.createFinancialAccountData(stepFive, recordId, status),
            successMessage: 'Financial account data submitted successfully',
        },
        6: {
            method: () => recordStore.createDocumentsData(stepSix, recordId, status),
            successMessage: 'Document Data submitted successfully',
        },
    };

    const stepHandler = stepsHandler[stepper.step];

    if (!stepHandler) {
        console.log("Unknown step, no data to submit.");
        return;
    }

    if (stepper.step > 1 && !recordId) {
        snackbar.showSnackbar('Please save step one first to create the record.', 'warning', []);
        return;
    }

    try {
        loading.value = true;
        const result = await stepHandler.method();
        snackbar.showSnackbar(stepHandler.successMessage, 'success', []);
        stepHandler.onSuccess?.(result as { id: string });
        if (shouldContinue && stepper.step !== 1) {
            continueNextStep();
        }
    } catch (error) {
        console.log("🚀 error:", error)
    } finally {
        loading.value = false;
    }
};

const saveDraft = async () => {
    if (stepper.step === stepper.items.length) {
        const recordId = route.params.recordId as string || '';
        if (!recordId) {
            snackbar.showSnackbar('Please save step one first to create a draft.', 'warning', []);
            return;
        }
        try {
            loading.value = true;
            await recordStore.createDocumentsData(stepSix, recordId, 'DRAFT');
            snackbar.showSnackbar('Draft saved successfully', 'success', []);
        } catch (error) {
            console.log('🚀 error:', error);
        } finally {
            loading.value = false;
        }
        return;
    }
    await submitStepData('DRAFT', false);
};

const submitFinalData = async () => {
    const recordId = route.params.recordId as string || '';
    if (!recordId) {
        snackbar.showSnackbar('Please save step one first before final submit.', 'warning', []);
        return;
    }
    try {
        loading.value = true;
        await recordStore.createDocumentsData(stepSix, recordId, 'COMPLETED');
        snackbar.showSnackbar('Data submitted successfully!', 'success', []);
        router.push({ name: "Records List" });
    } catch (error) {
        console.log('🚀 error:', error);
    } finally {
        loading.value = false;
    }
};


const revealedFields = reactive<Record<string, boolean>>({});
const isFieldRevealed = (key: string) => Boolean(revealedFields[key]);
const toggleFieldReveal = (key: string) => {
    revealedFields[key] = !revealedFields[key];
};

function setUploadUrl(url: string) {
    stepOne.profileImage = url;
    // console.log('File uploaded successfully! URL:', url);
}

function setUploadUrlForDoc(fileUrl: string, fileName: string, index: number) {
    stepSix.documents[index].file = fileUrl;
    if (!stepSix.documents[index].name) {
        stepSix.documents[index].name = fileName;
    }
}

const viewDocument = (index: number) => {
    currentDocumentUrl.value = stepSix.documents[index].file;
    isModalVisible.value = true;
};

const getDocumentAssetUrl = (file: string) => {
    if (file.startsWith('blob:') || file.startsWith('data:')) return file;
    if (file.startsWith('/api/')) return file.replace(/^\/api/, '');

    const assetBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    try {
        const fileUrl = new URL(file, window.location.origin);
        return `${assetBaseUrl}/${fileUrl.pathname.split('/').pop()}`;
    } catch {
        return `${assetBaseUrl}/${file.split('/').pop()}`;
    }
};

const downloadDocument = async (index: number) => {
    const document = stepSix.documents[index];
    if (!document.file) return;

    try {
        const response = await axiosInstance.get(getDocumentAssetUrl(document.file), {
            responseType: 'blob',
        });
        const fileUrl = URL.createObjectURL(response.data);
        const downloadLink = window.document.createElement('a');
        const extension = document.file.split('?')[0].split('.').pop();
        const documentName = document.name || 'document';
        const downloadName = extension && !documentName.toLowerCase().endsWith(`.${extension.toLowerCase()}`)
            ? `${documentName}.${extension}`
            : documentName;

        downloadLink.href = fileUrl;
        downloadLink.download = downloadName;
        window.document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } catch (error) {
        console.log('Document download error:', error);
        snackbar.showSnackbar('Could not download the document. Please try again.', 'error', []);
    }
};
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

        <v-stepper rounded="lg" class="record-stepper" :editable="stepper.edit" v-model="stepper.step" :items="stepper.items">
            <template v-slot:icon="{ step }">
                <CheckIcon v-if="Number(step) < stepper.step" size="16" />
                <template v-else>{{ step }}</template>
            </template>

            <!-- Step 1: Personal Details -->
            <template v-slot:item.1>
                <v-form v-model="stepOne.valid" class="step-one-form">
                    <v-card variant="outlined" class="step-one-card">
                        <v-card-title class="record-step-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <CameraIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">Profile Photo</div>
                                <div class="text-caption text-lightText">JPG or PNG, maximum 2 MB</div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-row no-gutters class="step-one-profile-row align-center">
                                <v-col cols="12" sm="auto" class="step-one-profile-image">
                                    <ProfileImage :url="stepOne.profileImage" />
                                </v-col>
                                <v-col cols="12" sm class="step-one-profile-upload">
                                    <FileUpload :label="`Upload Profile Image`" :accept="'image/jpeg, image/png'"
                                        :rules="[]" upload-path="/uploads/profile-staging" @uploaded="setUploadUrl" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="step-one-card">
                        <v-card-title class="record-step-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <UserIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">Basic Information</div>
                                <div class="text-caption text-lightText">Name, email, birth date, and gender</div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6" lg="4">
                                    <v-text-field variant="outlined" v-model="stepOne.firstName" label="First Name*"
                                        required :rules="[validationRules.required]" />
                                </v-col>
                                <v-col cols="12" sm="6" lg="4">
                                    <v-text-field variant="outlined" v-model="stepOne.lastName" label="Last Name" />
                                </v-col>
                                <v-col cols="12" sm="6" lg="4">
                                    <v-text-field variant="outlined" v-model="stepOne.email" label="Email*"
                                        :rules="[validationRules.required, validationRules.email]" />
                                </v-col>
                                <v-col cols="12" sm="6" lg="4">
                                    <v-text-field variant="outlined" v-model="stepOne.dateOfBirth" label="Date of Birth"
                                        type="date" />
                                </v-col>
                                <v-col cols="12" sm="6" lg="4">
                                    <v-select variant="outlined" v-model="stepOne.gender"
                                        :items="['male', 'female', 'other']" label="Gender" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="step-one-card">
                        <v-card-title class="record-step-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <PhoneIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">Contact Details</div>
                                <div class="text-caption text-lightText">Primary mobile and WhatsApp numbers</div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <div class="phone-input-field" :class="{ 'phone-input-field--error': mobileNumberInvalid }">
                                        <span class="phone-input-field__label">Mobile Number</span>
                                        <VueTelInput v-model="stepOne.mobileNumber" mode="international"
                                            @validate="onMobileNumberValidate" />
                                    </div>
                                    <div v-if="mobileNumberInvalid" class="phone-input-field__error">
                                        Please enter a valid mobile number.
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="phone-input-field" :class="{ 'phone-input-field--error': whatsappNumberInvalid }">
                                        <span class="phone-input-field__label">WhatsApp Number</span>
                                        <VueTelInput v-model="stepOne.whatsappNumber" mode="international"
                                            :disabled="whatsappSameAsMobile"
                                            @validate="onWhatsappNumberValidate" />
                                    </div>
                                    <div v-if="whatsappNumberInvalid" class="phone-input-field__error">
                                        Please enter a valid WhatsApp number.
                                    </div>
                                </v-col>
                            </v-row>
                            <div class="step-three-setting mt-3"
                                :class="{ 'step-three-setting--active': whatsappSameAsMobile }">
                                <div>
                                    <div class="text-subtitle-1 font-weight-medium">WhatsApp is the same number</div>
                                    <div class="text-caption text-lightText">Turn off to enter a different number</div>
                                </div>
                                <v-switch v-model="whatsappSameAsMobile"
                                    :color="whatsappSameAsMobile ? 'secondary' : 'grey'" hide-details inset
                                    @update:model-value="onToggleWhatsappSameAsMobile" />
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="step-one-card">
                        <v-card-title class="record-step-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <HomeIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">Home Address</div>
                                <div class="text-caption text-lightText">Primary residential address</div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <AddressFields
                                v-model:address-line1="stepOne.addressLine1"
                                v-model:address-line2="stepOne.addressLine2"
                                v-model:city="stepOne.city"
                                v-model:state="stepOne.state"
                                v-model:postal-code="stepOne.postalCode"
                                v-model:country="stepOne.country" />
                        </v-card-text>
                    </v-card>
                </v-form>
            </template>

            <!-- Step 2: Sensitive Details -->
            <template v-slot:item.2>
                <v-form v-model="stepTwo.valid" class="step-two-form">
                    <v-card variant="outlined" class="step-two-card">
                        <v-card-title class="step-two-header">
                            <div class="d-flex align-center ga-3">
                                <v-avatar color="lightsecondary" size="36">
                                    <IdIcon class="text-secondary" size="20" />
                                </v-avatar>
                                <div>
                                    <div class="text-subtitle-1 font-weight-bold">Identity Documents</div>
                                    <div class="text-caption text-lightText">Reference numbers only — files go in the Documents step</div>
                                </div>
                            </div>
                            <div class="d-flex align-center ga-3">
                                <span class="text-caption text-lightText">Encrypted at rest</span>
                                <v-btn color="secondary" variant="tonal" @click="addIdentityDocument">
                                    <PlusIcon size="18" class="mr-1" />
                                    Add Document
                                </v-btn>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-alert type="info" color="secondary" variant="tonal" density="compact"
                                class="step-two-alert mb-5 mt-1">
                                Document numbers are stored encrypted and hidden by default.
                            </v-alert>

                            <v-row>
                                <v-col cols="12" lg="6" v-for="(document, index) in stepTwo.identityDocuments"
                                    :key="index">
                                    <v-card variant="outlined" class="step-two-document-card">
                                        <v-card-title class="step-two-document-header">
                                            <span class="text-subtitle-1 font-weight-bold">Document {{ index + 1 }}</span>
                                            <v-btn class="remove-link-btn" variant="text" density="compact" size="small"
                                                @click="removeIdentityDocument(index)">
                                                Remove
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text class="step-two-document-body">
                                            <v-row>
                                                <v-col cols="12" sm="6">
                                                    <v-combobox variant="outlined" v-model="document.type"
                                                        :items="identityDocumentTypes" label="Document Type"
                                                        hide-details="auto" />
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-text-field class="sensitive-visibility-field" variant="outlined"
                                                        v-model="document.number" label="Document Number"
                                                        :type="isFieldRevealed(`identity-${index}`) ? 'text' : 'password'"
                                                        :append-inner-icon="isFieldRevealed(`identity-${index}`) ? '$eye' : '$eyeOff'"
                                                        @click:append-inner="toggleFieldReveal(`identity-${index}`)"
                                                        hide-details="auto" />
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-btn color="secondary" variant="tonal" block class="d-sm-none mt-2"
                                @click="addIdentityDocument">
                                <PlusIcon size="18" class="mr-1" />
                                Add Another Document
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-form>
            </template>

            <!-- Step 3: Occupation & Address -->
            <template v-slot:item.3>
                <v-form v-model="stepThree.valid" class="step-three-form">
                    <v-card variant="outlined" class="step-three-card">
                        <v-card-title class="step-three-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <BriefcaseIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-h5">Occupation</div>
                                <div class="text-caption text-lightText">Employment and retirement information</div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="outlined" v-model="stepThree.job" label="Occupation"
                                        required />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field variant="outlined" v-model="stepThree.retirementDate"
                                        label="Retirement Date" type="date" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="step-three-card">
                        <v-card-title class="step-three-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <MapPinIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-h5">Retirement & Location Details</div>
                                <div class="text-caption text-lightText">Record future residence and location details
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <div class="step-three-setting"
                                :class="{ 'step-three-setting--active': stepThree.isRedirected }">
                                <div>
                                    <div class="text-subtitle-1 font-weight-medium">Add Post-Retirement Address
                                    </div>
                                    <div class="text-caption text-lightText">Where this person plans to live after
                                        retirement</div>
                                </div>
                                <v-switch v-model="stepThree.isRedirected"
                                    :color="stepThree.isRedirected ? 'secondary' : 'grey'" hide-details inset />
                            </div>
                            <div class="step-three-setting"
                                :class="{ 'step-three-setting--active': stepThree.isAbroad }">
                                <div>
                                    <div class="text-subtitle-1 font-weight-medium">Living Abroad</div>
                                    <div class="text-caption text-lightText">Mark this person as living outside the
                                        country</div>
                                </div>
                                <v-switch v-model="stepThree.isAbroad"
                                    :color="stepThree.isAbroad ? 'secondary' : 'grey'" hide-details inset />
                            </div>

                            <v-expand-transition>
                                <v-row v-if="stepThree.isRedirected" class="mt-2">
                                    <v-col cols="12" md="6">
                                        <v-text-field variant="outlined" v-model="stepThree.redirectedAddressLine1"
                                            label="Post-Retirement Address Line 1" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field variant="outlined" v-model="stepThree.redirectedAddressLine2"
                                            label="Post-Retirement Address Line 2" />
                                    </v-col>
                                </v-row>
                            </v-expand-transition>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="step-three-card">
                        <v-card-title class="step-three-addresses-header">
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">Other Addresses</div>
                                <div class="text-caption text-lightText">Post-retirement, overseas, or correspondence</div>
                            </div>
                            <v-btn color="secondary" variant="tonal" @click="addAddress">
                                <PlusIcon size="18" class="mr-1" />
                                Add Address
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col v-for="(address, index) in stepThree.addresses" :key="index" cols="12">
                                    <v-card variant="outlined" class="step-three-address-card">
                                        <v-card-title class="step-three-address-card-header">
                                            <span class="text-subtitle-1 font-weight-bold">Address {{ index + 1 }}</span>
                                            <v-btn class="remove-link-btn" variant="text" density="compact" size="small"
                                                @click="removeAddress(index)">
                                                Remove
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text class="step-two-document-body">
                                            <v-row>
                                                <v-col cols="12" sm="6" lg="3">
                                                    <v-select variant="outlined" v-model="address.locationType"
                                                        :items="['Domestic', 'Abroad']"
                                                        label="Location Type" hide-details="auto" />
                                                </v-col>
                                            </v-row>
                                            <AddressFields
                                                compact
                                                v-model:address-line1="address.addressLine1"
                                                v-model:address-line2="address.addressLine2"
                                                v-model:city="address.city"
                                                v-model:state="address.state"
                                                v-model:postal-code="address.postalCode"
                                                v-model:country="address.country" />
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-btn color="secondary" variant="tonal" block class="d-sm-none mt-2"
                                @click="addAddress">
                                <PlusIcon size="18" class="mr-1" />
                                Add Another Address
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-form>
            </template>

            <!-- Step 4: Family Details -->
            <template v-slot:item.4>
                <v-form v-model="stepFour.valid" class="step-four-form">
                    <v-card variant="outlined" class="step-four-card">
                        <v-card-title class="record-step-card-header">
                            <v-avatar color="lightsecondary" size="36">
                                <HeartIcon class="text-secondary" size="20" />
                            </v-avatar>
                            <div>
                                <div class="text-subtitle-1 font-weight-bold">Marriage Information</div>
                                <div class="text-caption text-lightText">Optional marriage and previous-address details
                                </div>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" v-model="stepFour.marriageDate"
                                        label="Marriage Date" type="date" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field variant="outlined" v-model="stepFour.previousAddress"
                                        label="Previous Address" hide-details="auto" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="step-four-card">
                        <v-card-title class="step-four-children-header">
                            <div class="d-flex align-center ga-3">
                                <v-avatar color="lightsecondary" size="36">
                                    <UsersIcon class="text-secondary" size="20" />
                                </v-avatar>
                                <div>
                                    <div class="text-subtitle-1 font-weight-bold">Children</div>
                                    <div class="text-caption text-lightText">One entry per child</div>
                                </div>
                            </div>
                            <v-btn color="secondary" variant="tonal" @click="addChild">
                                <PlusIcon size="18" class="mr-1" />
                                Add Child
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" v-for="(child, index) in stepFour.children" :key="index">
                                    <v-card variant="outlined" class="step-four-child-card">
                                        <v-card-title class="step-four-child-header">
                                            <span class="text-subtitle-1 font-weight-bold">Child {{ index + 1 }}</span>
                                            <v-btn class="remove-link-btn" variant="text" density="compact" size="small"
                                                @click="removeChild(index)">
                                                Remove
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text class="step-two-document-body">
                                            <v-row>
                                                <v-col cols="12" sm="6" lg="4">
                                                    <v-text-field variant="outlined" v-model="child.name"
                                                        label="Child's Name" hide-details="auto" />
                                                </v-col>
                                                <v-col cols="12" sm="6" lg="4">
                                                    <v-text-field variant="outlined" v-model="child.dateOfBirth"
                                                        label="Child's Date of Birth" type="date"
                                                        hide-details="auto" />
                                                </v-col>
                                                <v-col cols="12" sm="6" lg="4">
                                                    <v-select variant="outlined" v-model="child.gender"
                                                        :items="['male', 'female', 'other']"
                                                        label="Child's Gender" hide-details="auto" />
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-btn color="secondary" variant="tonal" block class="d-sm-none mt-2" @click="addChild">
                                <PlusIcon size="18" class="mr-1" />
                                Add Another Child
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-form>
            </template>

            <!-- Step 5: Financial Accounts -->
            <template v-slot:item.5>
                <v-form v-model="stepFive.valid" class="step-five-form">
                    <v-card variant="outlined" class="step-five-card">
                        <v-card-title class="step-five-header">
                            <div class="d-flex align-center ga-3">
                                <v-avatar color="lightsecondary" size="36">
                                    <ShieldCheckIcon class="text-secondary" size="20" />
                                </v-avatar>
                                <div>
                                    <div class="text-subtitle-1 font-weight-bold">Financial Accounts</div>
                                    <div class="text-caption text-lightText">Bank, insurance, or other account references</div>
                                </div>
                            </div>
                            <div class="d-flex align-center ga-3">
                                <span class="text-caption text-lightText">Encrypted at rest</span>
                                <v-btn color="secondary" variant="tonal" @click="addFinancialAccount">
                                    <PlusIcon size="18" class="mr-1" />
                                    Add Account
                                </v-btn>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <v-alert type="info" color="secondary" variant="tonal" density="compact"
                                class="step-two-alert mb-5 mt-1">
                                Account numbers are stored encrypted and hidden by default.
                            </v-alert>
                            <v-row>
                                <v-col cols="12" v-for="(financialAccount, index) in stepFive.financialAccounts"
                                    :key="index">
                                    <v-card variant="outlined" class="step-five-account-card">
                                        <v-card-title class="step-five-account-header">
                                            <span class="text-subtitle-1 font-weight-bold">Account {{ index + 1 }}</span>
                                            <v-btn class="remove-link-btn" variant="text" density="compact" size="small"
                                                @click="removeFinancialAccount(index)">
                                                Remove
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text class="step-two-document-body">
                                            <v-row>
                                                <v-col cols="12" sm="6" lg="4">
                                                    <v-combobox variant="outlined" v-model="financialAccount.type"
                                                        :items="financialAccountTypes" label="Account Type"
                                                        hide-details="auto" />
                                                </v-col>
                                                <v-col cols="12" sm="6" lg="4">
                                                    <v-text-field variant="outlined" v-model="financialAccount.provider"
                                                        label="Provider" placeholder="e.g. City Bank"
                                                        hint="Bank, insurer, or fund name" persistent-hint
                                                        hide-details="auto" />
                                                </v-col>
                                                <v-col cols="12" sm="6" lg="4">
                                                    <v-text-field class="sensitive-visibility-field" variant="outlined"
                                                        v-model="financialAccount.number" label="Account Number"
                                                        :type="isFieldRevealed(`financial-${index}`) ? 'text' : 'password'"
                                                        :append-inner-icon="isFieldRevealed(`financial-${index}`) ? '$eye' : '$eyeOff'"
                                                        @click:append-inner="toggleFieldReveal(`financial-${index}`)"
                                                        hide-details="auto" />
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-btn color="secondary" variant="tonal" block class="d-sm-none mt-2"
                                @click="addFinancialAccount">
                                <PlusIcon size="18" class="mr-1" />
                                Add Another Account
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-form>
            </template>


            <!-- Step 6: Documents -->
            <template v-slot:item.6>
                <v-form class="step-six-form">
                    <v-card variant="outlined" class="step-six-card">
                        <v-card-title class="step-six-header">
                            <div class="d-flex align-center ga-3">
                                <v-avatar color="lightsecondary" size="36">
                                    <FileTextIcon class="text-secondary" size="20" />
                                </v-avatar>

                                <div>
                                    <div class="text-h5">Supporting Documents</div>
                                    <div class="text-caption text-lightText">
                                        Identity, address, or other supporting documents — PDF, JPG, or PNG, up to
                                        {{ DOCUMENT_MAX_SIZE_MB }} MB each.
                                    </div>
                                </div>
                            </div>

                            <div class="step-six-header__actions">
                                <div v-if="stepSix.documents.length" class="step-six-progress">
                                    <v-progress-linear :model-value="documentProgressPercent" color="secondary"
                                        bg-color="grey-lighten-2" height="6" rounded class="step-six-progress__bar" />
                                    <span class="text-caption text-lightText">
                                        {{ completedDocumentCount }}/{{ stepSix.documents.length }}
                                    </span>
                                </div>
                                <v-btn color="secondary" variant="tonal" @click="addBlankDocument">
                                    <PlusIcon size="18" class="mr-1" />
                                    Add Document
                                </v-btn>
                            </div>
                        </v-card-title>

                        <v-card-text>
                            <div class="documents-dropzone" @click="triggerBulkFilePicker" @dragover.prevent
                                @drop.prevent="handleBulkDrop">
                                <UploadIcon size="20" class="text-secondary" />
                                <span>
                                    <strong class="text-secondary">Choose files</strong>
                                    or drag them here — we'll create a row for each
                                </span>
                            </div>
                            <input ref="bulkFileInputRef" type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png"
                                @change="handleBulkFileInputChange" />
                            <input ref="rowFileInputRef" type="file" hidden accept=".pdf,.jpg,.jpeg,.png"
                                @change="handleRowFileInputChange" />

                            <div v-if="stepSix.documents.length" class="documents-list">
                                <div class="documents-list__label">Document</div>
                                <div v-for="(document, index) in stepSix.documents" :key="index" class="document-row">
                                    <div class="document-row__badge"
                                        :class="`document-row__badge--${getDocumentBadge(document).color}`">
                                        {{ getDocumentBadge(document).label }}
                                    </div>
                                    <div class="document-row__info">
                                        <input v-model="document.name" class="document-row__name"
                                            placeholder="e.g., ID Copy, Address Proof" />
                                        <div v-if="!document.file" class="document-row__meta document-row__meta--error">
                                            No file attached — required
                                        </div>
                                    </div>
                                    <v-chip :color="document.file ? 'success' : 'warning'" size="small" variant="tonal"
                                        class="document-row__status">
                                        {{ document.file ? 'Uploaded' : 'Needs file' }}
                                    </v-chip>
                                    <div class="document-row__actions">
                                        <template v-if="document.file">
                                            <v-tooltip text="Preview Document">
                                                <template #activator="{ props }">
                                                    <v-btn v-bind="props" icon variant="text" color="secondary"
                                                        size="small" @click="viewDocument(index)">
                                                        <EyeIcon size="18" />
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip text="Download Document">
                                                <template #activator="{ props }">
                                                    <v-btn v-bind="props" icon variant="text" color="secondary"
                                                        size="small" @click="downloadDocument(index)">
                                                        <DownloadIcon size="18" />
                                                    </v-btn>
                                                </template>
                                            </v-tooltip>
                                        </template>
                                        <v-btn v-else variant="outlined" color="secondary" size="small"
                                            @click="triggerRowFilePicker(index)">
                                            Upload
                                        </v-btn>
                                        <v-btn class="remove-link-btn" icon variant="text" size="small"
                                            :aria-label="`Remove document ${index + 1}`"
                                            @click="removeDocument(index)">
                                            <TrashIcon size="18" />
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                            <v-alert v-else type="info" color="secondary" variant="tonal" class="mt-3">
                                No documents added yet.
                            </v-alert>

                            <div v-if="incompleteDocumentCount > 0" class="text-error text-caption mt-3">
                                {{ incompleteDocumentCount }} document{{ incompleteDocumentCount > 1 ? 's' : '' }}
                                still need{{ incompleteDocumentCount > 1 ? '' : 's' }} a file.
                            </div>
                        </v-card-text>
                    </v-card>
                </v-form>

                <FileViewer :isVisible="isModalVisible" :file="currentDocumentUrl || ''"
                    @update:isVisible="isModalVisible = $event" />
            </template>

            <!-- Step 7: Review & Submit -->
            <template v-slot:item.7>
                <v-card variant="outlined" class="step-seven-card">
                    <v-card-title class="step-seven-header">
                        <div class="d-flex align-center ga-3">
                            <v-avatar color="lightsecondary" size="36">
                                <ClipboardCheckIcon class="text-secondary" size="20" />
                            </v-avatar>

                            <div>
                                <div class="text-h5">Review & Submit</div>
                                <div class="text-caption text-lightText">
                                    Check all entered details before submitting
                                </div>
                            </div>
                        </div>
                    </v-card-title>

                    <v-card-text>
                        <ViewComponent
                            :form="{ ...stepOne, ...stepTwo, ...stepThree, ...stepFour, ...stepFive, ...stepSix }"
                            review-mode @jump-to-step="stepper.step = $event" />
                    </v-card-text>
                </v-card>
            </template>

            <!-- Custom Next and Prev buttons -->
            <template v-slot:actions="{ }">
                <v-row class="d-flex align-center justify-space-between ma-5">
                    <v-btn :disabled="stepper.step === 1" color="secondary" size="default" density="default"
                        @click="previousStep">
                        Back
                    </v-btn>

                    <v-spacer></v-spacer>

                    <DropdownButton v-if="stepper.step < stepper.items.length" :loading="loading"
                        :disabled="!isCurrentStepValid" primary-label="Save & Continue" secondary-label="Save Draft"
                        :compact="true" @primary-click="submitStepData('DRAFT', true)" @secondary-click="saveDraft" />

                    <DropdownButton v-else :loading="loading" :compact="true" primary-label="Finish & Submit"
                        secondary-label="Save Draft" @primary-click="submitStepper" @secondary-click="saveDraft" />
                </v-row>
            </template>
        </v-stepper>
</template>

<style scoped>
.step-one-card {
    position: relative;
}

.step-one-card:focus-within {
    z-index: 10;
}

.phone-input-field {
    position: relative;
    margin-top: 10px;
}

.phone-input-field__label {
    position: absolute;
    top: -8px;
    left: 12px;
    padding: 0 4px;
    font-size: 0.75rem;
    line-height: 1;
    background: rgb(var(--v-theme-surface));
    color: rgba(var(--v-theme-on-surface), 0.6);
    z-index: 1;
}

.phone-input-field--error .phone-input-field__label {
    color: rgb(var(--v-theme-error));
}

.phone-input-field__error {
    color: rgb(var(--v-theme-error));
    font-size: 0.75rem;
    margin-top: 4px;
    padding-left: 12px;
}

:deep(.vue-tel-input) {
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    height: 45px;
    background: rgb(var(--v-theme-surface));
}

:deep(.vti__input) {
    box-sizing: border-box;
    height: 100%;
}

.phone-input-field:focus-within :deep(.vue-tel-input) {
    border-color: rgba(var(--v-theme-on-surface), 0.87);
    border-width: 2px;
}

.phone-input-field--error :deep(.vue-tel-input) {
    border-color: rgb(var(--v-theme-error));
}

:deep(.vti__dropdown-list) {
    z-index: 20;
    border-radius: 8px;
    margin-top: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.sensitive-visibility-field .v-field__append-inner .v-icon) {
    color: rgb(var(--v-theme-secondary));
    opacity: 1;
}

:deep(.sensitive-visibility-field .v-field__append-inner) {
    opacity: 1;
}

.remove-link-btn {
    color: rgb(var(--v-theme-lightText));
}

.remove-link-btn:hover {
    color: rgb(var(--v-theme-error));
    background: rgba(var(--v-theme-error), 0.08);
}

.step-three-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step-four-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step-five-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step-five-card {
    border-color: rgba(var(--v-border-color), 0.15);
}

.step-five-header,
.step-five-account-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.step-five-header {
    padding: 16px 20px;
}

.step-five-account-card {
    height: 100%;
    overflow: hidden;
}

.step-five-account-header {
    padding: 11px 16px;
    background: rgba(var(--v-theme-on-surface), 0.035);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.15);
}

.step-four-card {
    border-color: rgba(var(--v-border-color), 0.15);
}

.step-four-children-header,
.step-four-child-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.step-four-children-header {
    padding: 16px 20px;
}

.step-four-child-card {
    height: 100%;
    overflow: hidden;
}

.step-four-child-header {
    padding: 11px 16px;
    background: rgba(var(--v-theme-on-surface), 0.035);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.15);
}

.step-one-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step-two-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step-two-card {
    border-color: rgba(var(--v-border-color), 0.15);
}

.step-two-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
}

.step-two-alert {
    border-radius: 10px;
}

.step-two-document-card {
    overflow: hidden;
}

.step-two-document-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 16px;
    background: rgba(var(--v-theme-on-surface), 0.035);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.15);
}

.step-two-document-body {
    padding-top: 28px;
}

.step-one-card {
    border-color: rgba(var(--v-border-color), 0.15);
}

.record-step-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
}

.step-one-profile-image :deep(.v-col) {
    padding: 0;
}

.step-one-profile-row {
    gap: 20px;
}

.step-one-profile-image {
    width: 120px;
}

.step-one-profile-upload {
    min-width: 0;
}

.record-stepper :deep(.v-stepper-item--selected .v-stepper-item__avatar) {
    color: rgb(var(--v-theme-on-secondary));
    background: rgb(var(--v-theme-secondary));
}

.record-stepper :deep(.v-stepper-item--selected .v-stepper-item__title) {
    color: rgb(var(--v-theme-secondary));
}

.step-three-card {
    border-color: rgba(var(--v-border-color), 0.15);
}

.step-three-card-header,
.step-three-addresses-header,
.step-three-address-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.step-three-card-header {
    justify-content: flex-start;
    padding: 16px 20px;
}

.step-three-addresses-header {
    padding: 16px 20px;
}

.step-three-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 64px;
    padding: 10px 14px;
    margin-bottom: 10px;
    border-radius: 12px;
    border: 1px solid rgba(var(--v-border-color), 0.12);
    background: rgba(var(--v-theme-on-surface), 0.035);
    transition: background-color 160ms ease, border-color 160ms ease;
}

.step-three-setting--active {
    border-color: rgba(var(--v-theme-secondary), 0.14);
    background: rgb(var(--v-theme-lightsecondary));
}

.step-three-address-card {
    height: 100%;
    overflow: hidden;
}

.step-three-address-card-header {
    padding: 11px 16px;
    background: rgba(var(--v-theme-on-surface), 0.035);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.15);
}

@media (max-width: 599px) {
    .step-one-form {
        gap: 12px;
    }

    .step-two-form {
        gap: 12px;
    }

    .step-two-header {
        align-items: flex-start;
        padding: 14px;
    }

    .step-two-header .v-btn {
        min-width: 40px;
        padding-inline: 8px;
        font-size: 0;
    }

    .record-step-card-header {
        padding: 14px;
    }

    .step-one-profile-row {
        gap: 12px;
    }

    .step-one-profile-image {
        width: 100%;
    }

    .step-three-form {
        gap: 12px;
    }

    .step-four-form {
        gap: 12px;
    }

    .step-five-form {
        gap: 12px;
    }

    .step-five-header {
        align-items: flex-start;
        padding: 14px;
    }

    .step-five-header>.v-btn {
        display: none;
    }

    .step-four-children-header {
        align-items: flex-start;
        padding: 14px;
    }

    .step-four-children-header>.v-btn {
        display: none;
    }

    .step-three-card-header,
    .step-three-addresses-header {
        padding: 14px;
    }

    .step-three-addresses-header {
        align-items: flex-start;
    }

    .step-three-addresses-header .v-btn {
        display: none;
    }

    .step-three-setting {
        min-height: 72px;
        padding: 12px;
    }

}

.step-six-card {
    border-radius: 12px;
}

.step-six-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    padding: 20px 24px;
}

.step-six-header__actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.step-six-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 96px;
}

.step-six-progress__bar {
    width: 72px;
}

.documents-dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px 16px;
    border: 1px dashed rgba(var(--v-border-color), 0.4);
    border-radius: 12px;
    background: rgba(var(--v-theme-on-surface), 0.02);
    cursor: pointer;
    text-align: center;
    color: rgba(var(--v-theme-on-surface), 0.7);
    font-size: 0.875rem;
}

.documents-dropzone:hover {
    background: rgba(var(--v-theme-on-surface), 0.035);
    border-color: rgba(var(--v-theme-on-surface), 0.5);
}

.documents-list {
    margin-top: 20px;
}

.documents-list__label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(var(--v-theme-on-surface), 0.5);
    padding: 0 4px 8px;
}

.document-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 4px;
    border-top: 1px solid rgba(var(--v-border-color), 0.15);
    flex-wrap: wrap;
}

.document-row__badge {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
    background: rgba(var(--v-theme-on-surface), 0.06);
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.document-row__badge--red {
    background: rgba(var(--v-theme-error), 0.12);
    color: rgb(var(--v-theme-error));
}

.document-row__badge--blue,
.document-row__badge--indigo {
    background: rgba(var(--v-theme-secondary), 0.12);
    color: rgb(var(--v-theme-secondary));
}

.document-row__info {
    flex: 1 1 200px;
    min-width: 0;
}

.document-row__name {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface));
    padding: 2px 0;
}

.document-row__name::placeholder {
    font-weight: 400;
    color: rgba(var(--v-theme-on-surface), 0.4);
}

.document-row__meta {
    font-size: 0.75rem;
    color: rgba(var(--v-theme-on-surface), 0.5);
}

.document-row__meta--error {
    color: rgb(var(--v-theme-error));
}

.document-row__status {
    flex: 0 0 auto;
}

.document-row__actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 2px;
}

@media (max-width: 600px) {
    .step-six-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .step-six-header__actions {
        width: 100%;
        justify-content: space-between;
    }

    .document-row {
        position: relative;
        padding-right: 40px;
    }

    .document-row__status {
        order: 1;
    }

    .document-row__actions {
        position: absolute;
        top: 12px;
        right: 4px;
    }
}

.step-seven-card {
    border-radius: 12px;
}

.step-seven-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
}
</style>
