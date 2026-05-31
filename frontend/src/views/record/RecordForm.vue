<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import axiosInstance from '@/axiosInstance.interceptor';
import DropdownButton from '@/components/shared/DropdownButton.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useForm } from '@/composables/useForm';
import { useValidation } from '@/composables/useValidation';
import type { RecordDetail, RecordStatus } from '@/interfaces/record.interface';
import { useRecordStore } from '@/stores/record';
import { useSnackbarStore } from '@/stores/snackbar.store';
import FileUpload from '@/views/record/components/FileUpload.vue';
import FileViewer from '@/views/record/components/FileViewer.vue';
import ProfileImage from '@/views/record/components/ProfileImage.vue';
import ViewComponent from '@/views/record/components/ViewComponent.vue';
import { computed, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const loading = ref(false);
const snackbar = useSnackbarStore();
const router = useRouter()
const validationRules = useValidation();
const recordStore = useRecordStore();
const {
    stepOneInitialState,
    stepTwoInitialState,
    stepThreeInitialState,
    stepFourInitialState,
    stepFiveInitialState,
    stepSixInitialState
} = useForm();

const page = ref({ title: 'Record Collection' });
const breadcrumbs = shallowRef([
    { title: 'Records', disabled: false, href: '#' },
    { title: route.name ? String(route.name) : "", disabled: true, href: '#' }
]);
const stepper = reactive({
    step: 1,
    edit: false,
    show1: false,
    show2: true,
    items: ['Personal Details', 'Sensitive Details', 'Occupation & Address', 'Family Details', 'Policies', 'Documents', 'Review & Submit'],
});
const stepOne = reactive({ ...stepOneInitialState });
const stepTwo = reactive({ ...stepTwoInitialState });
const stepThree = reactive({ ...stepThreeInitialState });
const stepFour = reactive({ ...stepFourInitialState });
const stepFive = reactive({ ...stepFiveInitialState });
const stepSix = reactive({ ...stepSixInitialState });
const isUnlocked = ref(false);
const isModalVisible = ref(false);
const currentDocumentUrl = ref<string>('');
const ocrLoading = ref(false);
const ocrScanFile = ref<File | File[] | null>(null);

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
        houseName: '',
        houseNumber: '',
        streetName: '',
        streetNumber: '',
        village: '',
        postOffice: '',
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

const uploadDocument = () => {
    stepSix.documents.push({
        name: '',
        file: ''
    });
};

const removeDocument = (index: number) => {
    stepSix.documents.splice(index, 1);
};

const addPolicy = () => {
    stepFive.policies.push({
        type: '',
        number: '',
    });
};

const removePolicy = (index: number) => {
    stepFive.policies.splice(index, 1);
}
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
    const steps = [stepOne, stepTwo, stepThree, stepFour, stepFive, stepSix];
    steps.forEach(step => Object.assign(step, record));
};

onMounted(() => {
    // const One = {
    //     "id": "",
    //     "valid": true,
    //     "profileImage": "http://localhost:5001/1738053289968-Screenshot from 2025-01-25 14-22-46.png",
    //     "email": "asdfff@gmail.com",
    //     "firstName": "Alshoja",
    //     "lastName": "m ikbal",
    //     "houseName": "Padannamakal",
    //     "houseNumber": "123",
    //     "streetName": "Street ",
    //     "streetNumber": "132",
    //     "postOffice": "652234",
    //     "village": "Village",
    //     "panchayat": "Panchayath",
    //     "district": "District",
    //     "mobileNumber": "9967521656",
    //     "whatsappNumber": "",
    //     "dateOfBirth": "2025-01-28",
    //     "gender": "male"
    // }
    // Object.assign(stepOne, One);
});

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

const submitStepData = async (status: RecordStatus = 'IN_PROGRESS', shouldContinue = true) => {
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
            method: () => recordStore.createPolicyData(stepFive, recordId, status),
            successMessage: 'Policy Data submitted successfully',
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
        router.push({ name: "Family Details Collection" });
    } catch (error) {
        console.log('🚀 error:', error);
    } finally {
        loading.value = false;
    }
};


const checkPassword = () => {
    const correctPassword = 'alshoja';
    if (stepTwo.password === correctPassword) {
        isUnlocked.value = true;
    } else {
        isUnlocked.value = false;
    }
};

function setUploadUrl(url: string) {
    stepOne.profileImage = url;
    // console.log('File uploaded successfully! URL:', url);
}

function setUploadUrlForDoc(fileUrl: string, index: number) {
    stepSix.documents[index].file = fileUrl;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatOcrDob = (dob?: string | null): string => {
    if (!dob) return '';
    const parts = dob.split('/');
    if (parts.length !== 3) return '';
    const [dd, mm, yyyy] = parts;
    if (!dd || !mm || !yyyy) return '';
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
};

const applyOcrResultToForm = (result: {
    name?: string | null
    dob?: string | null
    gender?: string | null
    aadhaar?: string | null
    pin?: string | null
}) => {
    if (result.aadhaar) {
        stepTwo.aadhaarNumber = result.aadhaar;
    }
    if (result.dob) {
        const dob = formatOcrDob(result.dob);
        if (dob) stepOne.dateOfBirth = dob;
    }
    if (result.gender) {
        const normalizedGender = result.gender.toLowerCase();
        if (['male', 'female', 'other'].includes(normalizedGender)) {
            stepOne.gender = normalizedGender;
        }
    }
    if (result.name) {
        const parts = result.name.trim().split(/\s+/);
        if (parts.length > 0 && !stepOne.firstName) {
            stepOne.firstName = parts[0];
        }
        if (parts.length > 1 && !stepOne.lastName) {
            stepOne.lastName = parts.slice(1).join(' ');
        }
    }
    if (result.pin && !stepOne.postOffice) {
        stepOne.postOffice = result.pin;
    }
};

const runOcrAutofill = async () => {
    const selectedFile = Array.isArray(ocrScanFile.value) ? ocrScanFile.value[0] : ocrScanFile.value;
    if (!(selectedFile instanceof File)) {
        snackbar.showSnackbar('Please choose a file for OCR scan.', 'warning', []);
        return;
    }
    try {
        ocrLoading.value = true;
        const formData = new FormData();
        formData.append('file', selectedFile);
        const submitResponse = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/extract/text`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const jobId = submitResponse.data?.jobId ? String(submitResponse.data.jobId) : null;
        if (!jobId) {
            snackbar.showSnackbar('Failed to submit OCR scan.', 'error', []);
            return;
        }

        const maxAttempts = 20;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const resultResponse = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/extract/text/${jobId}`);
            const result = resultResponse.data?.result;
            if (!result) {
                await sleep(1500);
                continue;
            }
            if (result.pending) {
                await sleep(1500);
                continue;
            }
            if (result.error) {
                snackbar.showSnackbar(`OCR failed: ${result.error}`, 'error', []);
                return;
            }

            applyOcrResultToForm(result);
            snackbar.showSnackbar('OCR scan completed. Please verify values before saving.', 'success', []);
            return;
        }
        snackbar.showSnackbar('OCR is taking longer than expected. Please try again.', 'warning', []);
    } catch (error) {
        console.log('OCR error:', error);
        const message = error instanceof Error ? error.message : 'OCR scan failed. Please try again.';
        snackbar.showSnackbar(message, 'error', []);
    } finally {
        ocrLoading.value = false;
    }
};
const viewDocument = (index: number) => {
    currentDocumentUrl.value = stepSix.documents[index].file;
    isModalVisible.value = true;
};
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
    <UiParentCard title="Create Record">

        <v-stepper rounded="lg" :editable="stepper.edit" v-model="stepper.step" :items="stepper.items">
            <!-- Step 1: Personal Details -->
            <template v-slot:item.1>
                <v-form v-model="stepOne.valid">
                    <UiParentCard title="Personal Information">
                        <v-row class="mb-4">
                            <ProfileImage :url="stepOne.profileImage" />
                            <v-col cols="12" md="12" class="border border-secondary rounded">
                                <FileUpload :label="`Upload Profile Image`" :accept="'image/jpeg, image/png'"
                                    :rules="[]" @uploaded="setUploadUrl" />
                            </v-col>
                        </v-row>
                        <v-row class="border border-secondary rounded pa-2 mb-3">
                            <v-col cols="12">
                                <v-alert type="warning" variant="tonal" density="comfortable">
                                    OCR scan is assistive only. Use it with caution and verify all extracted values
                                    before saving.
                                </v-alert>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-file-input v-model="ocrScanFile" variant="outlined" label="Upload File For OCR Scan"
                                    accept=".pdf,image/png,image/jpeg" :disabled="ocrLoading" />
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex align-center mb-5">
                                <v-btn variant="outlined" color="secondary" :loading="ocrLoading" :disabled="ocrLoading"
                                    @click="runOcrAutofill">
                                    Scan & Auto Fill
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row class="border border-secondary rounded pa-2 mb-3">
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.firstName" label="First Name*"
                                    required :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.lastName" label="Last Name" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.email" label="Email*"
                                    :rules="[validationRules.required, validationRules.email]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.houseName" label="House Name" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.houseNumber" label="House Number" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.streetName" label="Street Name" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.streetNumber" label="Street Number" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field type="number" variant="outlined" v-model="stepOne.postOffice"
                                    label="Post Office" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.village" label="Village" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.panchayat" label="Panchayat" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.district" label="District" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.mobileNumber"
                                    label="Mobile Number(+91)" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.whatsappNumber"
                                    label="WhatsApp Number(+91)" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.dateOfBirth" label="Date of Birth"
                                    type="date" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select variant="outlined" v-model="stepOne.gender"
                                    :items="['male', 'female', 'other']" label="Gender" />
                            </v-col>
                        </v-row>
                    </UiParentCard>
                </v-form>
            </template>

            <!-- Step 2: Sensitive Details -->
            <template v-slot:item.2>
                <v-form v-model="stepTwo.valid">
                    <UiParentCard title="Identity Documents">
                        <v-row class="border border-secondary rounded pa-2 mb-3">
                            <!-- Password Input to Unlock Data -->
                            <v-col cols="12" md="12">
                                <v-text-field variant="outlined" v-if="!isUnlocked"
                                    label="Enter password to unlock sensitive data" v-model="stepTwo.password"
                                    type="password" @input="checkPassword" />
                            </v-col>

                            <!-- Sensitive Data Inputs (Initially hidden) -->
                            <v-col v-if="isUnlocked" cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepTwo.aadhaarNumber" label="Aadhaar Number"
                                    :rules="[validationRules.maxLength(12), validationRules.minLength(12)]" />
                            </v-col>
                            <v-col v-if="isUnlocked" cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepTwo.drivingLicense"
                                    label="Driving License"
                                    :rules="[validationRules.maxLength(15), validationRules.minLength(15)]" />
                            </v-col>
                            <v-col v-if="isUnlocked" cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepTwo.electionID" label="Election ID"
                                    :rules="[validationRules.maxLength(10), validationRules.minLength(10)]" />
                            </v-col>
                            <v-col v-if="isUnlocked" cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepTwo.passportNumber"
                                    label="Passport Number"
                                    :rules="[validationRules.maxLength(8), validationRules.minLength(8)]" />
                            </v-col>
                            <v-col v-if="isUnlocked" cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepTwo.postBoxNumber"
                                    label="Post Box Number" />
                            </v-col>
                        </v-row>
                    </UiParentCard>
                </v-form>
            </template>

            <!-- Step 3: Occupation & Address -->
            <template v-slot:item.3>
                <v-form v-model="stepThree.valid">
                    <UiParentCard title="Occupation">
                        <v-row class="border border-secondary rounded pa-2 mb-3">
                            <!-- Occupation -->
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepThree.job" label="Occupation (ജോലി)"
                                    required />
                            </v-col>
                            <!-- Retirement Date -->
                            <v-col cols="12" md="3">
                                <v-text-field variant="outlined" v-model="stepThree.retirementDate"
                                    label="Retirement Date (വിരമിക്കുന്ന തീയതി)" type="date" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-checkbox v-model="stepThree.isRedirected" label="Redirection Address (Retd Add.)" />
                            </v-col>
                            <v-col cols="12" md="6" v-if="stepThree.isRedirected">
                                <v-text-field variant="outlined" v-model="stepThree.redirectedHouseName"
                                    label="Redirected House Name" />
                            </v-col>
                            <v-col cols="12" md="6" v-if="stepThree.isRedirected">
                                <v-text-field variant="outlined" v-model="stepThree.redirectedHouseNumber"
                                    label="Redirected House Number" />
                            </v-col>
                        </v-row>
                    </UiParentCard>

                    <!-- Multiple Addresses -->
                    <v-row>
                        <v-col cols="12">
                            <UiParentCard title="Other Addresses">
                                <v-row class="border border-secondary rounded pa-2 mb-3"
                                    v-for="(address, index) in stepThree.addresses" :key="index">
                                    <!-- <v-col cols="12" md="0">
                                            <v-badge color="info" :content="index + 1" inline></v-badge>
                                        </v-col> -->
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="address.houseName"
                                            label="House Name" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="address.houseNumber"
                                            label="House Number" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="address.streetName"
                                            label="Street Name" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="address.streetNumber"
                                            label="Street Number" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="address.village"
                                            label="Village (വില്ലേജ്)" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="address.postOffice"
                                            label="Post Office (പോസ്റ്റ് ഓഫീസ്)" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-select variant="outlined" v-model="address.locationType"
                                            :items="['Domestic (സ്വദേശത്ത്)', 'Abroad (വിദേശത്ത്)']"
                                            label="Location Type" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-card-actions>
                                            <v-btn color="error" @click="removeAddress(index)">Remove</v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-btn color="secondary" @click="addAddress">New Address</v-btn>
                                    </v-col>
                                </v-row>
                            </UiParentCard>
                        </v-col>
                    </v-row>
                </v-form>
            </template>

            <!-- Step 4: Family Details -->
            <template v-slot:item.4>
                <v-form v-model="stepFour.valid">
                    <UiParentCard title="Marriage Information">
                        <v-row class="border border-secondary rounded pa-2 mb-3">
                            <!-- Marriage Details -->
                            <v-col cols="12" md="3">
                                <v-text-field variant="outlined" v-model="stepFour.marriageDate"
                                    label="Marriage Date (വിവാഹം നടന്ന തീയതി, മാസം, വർഷം)" type="date" />
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-text-field variant="outlined" v-model="stepFour.previousAddress"
                                    label="Previous Address (മുമ്പത്തെ മേൽവിലാസം)" />
                            </v-col>
                        </v-row>
                    </UiParentCard>
                    <!-- Childbirth Details -->
                    <UiParentCard title="Child Record">
                        <v-row>
                            <v-col cols="12" v-for="(child, index) in stepFour.children" :key="index">
                                <v-row class="border border-secondary rounded  mb-1">
                                    <v-col cols="12" md="4">
                                        <v-text-field variant="outlined" v-model="child.name" label="Child's Name"
                                            required />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="child.dateOfBirth"
                                            label="Child's Date of Birth (കുട്ടി ജനിച്ച തീയതി)" type="date" required />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <v-select variant="outlined" v-model="child.gender" :items="['male', 'female']"
                                            label="Child's Gender (Male/ Female)" required />
                                    </v-col>
                                    <v-col cols="12" md="2">
                                        <v-card-actions>
                                            <v-btn color="error" @click="removeChild(index)">Remove</v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="secondary" @click="addChild">Add Child</v-btn>
                            </v-col>
                        </v-row>
                    </UiParentCard>
                </v-form>
            </template>

            <!-- Step 5: Policy -->
            <template v-slot:item.5>
                <v-form v-model="stepFive.valid">
                    <UiParentCard title="Policy Details">
                        <v-row>
                            <v-col cols="12" v-for="(policy, index) in stepFive.policies" :key="index">
                                <v-row class="border border-secondary rounded pa-2 mb-3">
                                    <v-col cols="12" md="4">
                                        <v-select variant="outlined" v-model="policy.type"
                                            :items="['Account Number', 'PLI Number', 'RPLI Number', 'IPPB Number', 'Savings Bank Number', 'Other Account Numbers']"
                                            label="Policy Type" required />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field variant="outlined" v-model="policy.number" label="Policy Number"
                                            required />
                                    </v-col>
                                    <v-col cols="12" md="1">
                                        <v-card-actions>
                                            <v-btn color="error" @click="removePolicy(index)">Remove</v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="secondary" @click="addPolicy">Add Policy</v-btn>
                            </v-col>
                        </v-row>
                    </UiParentCard>
                </v-form>
            </template>


            <!-- Step 5: Documents -->
            <template v-slot:item.6>
                <v-form v-model="stepSix.valid">
                    <UiParentCard title="Supporting Documents">
                        <v-row>
                            <v-col cols="12" v-for="(document, index) in stepSix.documents" :key="index">
                                <v-row class="border border-secondary rounded pa-2 mb-3">
                                    <v-col cols="12" md="3">
                                        <v-text-field variant="outlined" v-model="document.name"
                                            label="Document Name (e.g., Aadhaar Copy, Address Proof)"
                                            :rules="[validationRules.required]" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <FileUpload :label="`Upload Document`" :rules="[validationRules.required]"
                                            @uploaded="(fileUrl) => setUploadUrlForDoc(fileUrl, index)" />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-card-actions>
                                            <v-btn color="error" @click="removeDocument(index)">Remove</v-btn>
                                            <v-btn color="primary" @click="viewDocument(index)">View Document</v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="secondary" @click="uploadDocument">Add Document</v-btn>
                            </v-col>
                        </v-row>
                    </UiParentCard>
                </v-form>
                <FileViewer :isVisible="isModalVisible" :file="currentDocumentUrl || ''"
                    @update:isVisible="isModalVisible = $event" />
            </template>

            <!-- Step 6: Review and submit  -->
            <template v-slot:item.7>
                <UiParentCard title="Review & Submit">
                    <ViewComponent
                        :form="{ ...stepOne, ...stepTwo, ...stepThree, ...stepFour, ...stepFive, ...stepSix }" />
                </UiParentCard>
            </template>

            <!-- Custom Next and Prev buttons -->
            <template v-slot:actions="{}">
                <v-row class="d-flex align-center justify-space-between ma-5">
                    <v-btn :disabled="stepper.step === 1" outlined color="secondary" size="default" density="default"
                        @click="previousStep">
                        Back
                    </v-btn>

                    <v-spacer></v-spacer>

                    <DropdownButton v-if="stepper.step < stepper.items.length" :loading="loading"
                        :disabled="!isCurrentStepValid" primary-label="Save & Continue" secondary-label="Save Draft"
                        :compact="true"
                        @primary-click="submitStepData('IN_PROGRESS', true)" @secondary-click="saveDraft" />

                    <DropdownButton v-else :loading="loading" :compact="true" primary-label="Finish & Submit"
                        secondary-label="Save Draft" @primary-click="submitStepper" @secondary-click="saveDraft" />
                </v-row>
            </template>
        </v-stepper>
    </UiParentCard>

</template>

<style scoped></style>
