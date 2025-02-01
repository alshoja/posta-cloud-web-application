<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useForm } from '@/composables/useForm';
import { useValidation } from '@/composables/useValidation';
import type { RecordDetail } from '@/interfaces/record.interface';
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
            } catch (error) {
                if ((error as { status: number }).status === 404) {
                    router.push({ name: "NotFound" });
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            }
        } else {
            resetForm(stepOne, stepOneInitialState);
        }
    },
    { immediate: true }
);


const setFormFields = (record: RecordDetail) => {
    const steps = [stepOne, stepTwo, stepThree, stepFour, stepFive, stepSix];
    steps.forEach(step => Object.assign(step, record));
};

onMounted(() => {
    // const One = {
    //     "id": "",
    //     "valid": true,
    //     "profileImage": "http://localhost:5000/1738053289968-Screenshot from 2025-01-25 14-22-46.png",
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
    router.push({ name: "Family Details Collection" });
    snackbar.showSnackbar("Data submitted successfully!", 'success', []);
};

const continueNextStep = () => {
    if (isCurrentStepValid.value) stepper.step++;
}

const previousStep = () => {
    if (stepper.step > 1) stepper.step--;
};

// const gotToStep = (step: number) => (stepper.step = step);

const submitStepData = async () => {
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
                return await recordStore.createPersonalData(stepOne);
            },
            successMessage: 'Personal Data updated successfully',
            onSuccess: (res: { id: string }) => {
                if (stepper.edit) {
                    continueNextStep();
                } else {
                    router.push({ name: 'Edit Record', params: { recordId: res.id } });
                    continueNextStep();
                }
            }
        },
        2: {
            method: () => recordStore.createIdentificationData(stepTwo, recordId),
            successMessage: 'Identification Data submitted successfully',
        },
        3: {
            method: () => recordStore.createOccupationData(stepThree, recordId),
            successMessage: 'Occupation Data submitted successfully',
        },
        4: {
            method: () => recordStore.createFamilyData(stepFour, recordId),
            successMessage: 'Family Data submitted successfully',
        },
        5: {
            method: () => recordStore.createPolicyData(stepFive, recordId),
            successMessage: 'Policy Data submitted successfully',
        },
        6: {
            method: () => recordStore.createDocumentsData(stepSix, recordId),
            successMessage: 'Document Data submitted successfully',
        },
    };

    const stepHandler = stepsHandler[stepper.step];

    if (!stepHandler) {
        console.log("Unknown step, no data to submit.");
        return;
    }

    try {
        loading.value = true;
        const result = await stepHandler.method();
        snackbar.showSnackbar(stepHandler.successMessage, 'success', []);
        stepHandler.onSuccess?.(result as { id: string });
        continueNextStep();
    } catch (error) {
        console.log("🚀 error:", error)
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
                                    :rules="[validationRules.required]" @uploaded="setUploadUrl" />
                            </v-col>
                        </v-row>

                        <v-row class="border border-secondary rounded pa-2 mb-3">
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.firstName" label="First Name*"
                                    required :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.lastName" label="Last Name*" required
                                    :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.email" label="Email*"
                                    :rules="[validationRules.required, validationRules.email]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.houseName" label="House Name*"
                                    :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.houseNumber" label="House Number" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.streetName" label="Street Name*"
                                    :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.streetNumber" label="Street Number" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field type="number" variant="outlined" v-model="stepOne.postOffice"
                                    label="Post Office*"
                                    :rules="[validationRules.required, validationRules.maxLength(6), validationRules.minLength(6)]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.village" label="Village*"
                                    :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.panchayat" label="Panchayat*"
                                    :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.district" label="District*"
                                    :rules="[validationRules.required]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.mobileNumber"
                                    label="Mobile Number(+91)" required
                                    :rules="[validationRules.required, validationRules.mobileNumber]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.whatsappNumber"
                                    label="WhatsApp Number(+91)" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field variant="outlined" v-model="stepOne.dateOfBirth" label="Date of Birth*"
                                    type="date" required
                                    :rules="[validationRules.required, validationRules.dateOfBirth]" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select variant="outlined" v-model="stepOne.gender"
                                    :items="['male', 'female', 'other']" label="Gender*" required
                                    :rules="[validationRules.required, validationRules.gender]" />
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
                    <v-btn :disabled="stepper.step === 1" outlined color="secondary" @click="previousStep">
                        Back
                    </v-btn>

                    <v-spacer></v-spacer>

                    <v-btn :loading="loading" v-if="stepper.step < stepper.items.length" color="secondary"
                        :disabled="!isCurrentStepValid" @click="submitStepData">
                        Save & Continue
                    </v-btn>

                    <v-btn v-if="stepper.step === stepper.items.length" color="secondary" @click="submitStepper">
                        Finish & Submit
                    </v-btn>
                </v-row>
            </template>
        </v-stepper>
    </UiParentCard>

</template>

<style scoped></style>