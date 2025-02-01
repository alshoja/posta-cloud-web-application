<script lang="ts" setup>
import { reactive, ref } from 'vue';
import ProfileImage from '@/views/record/components/ProfileImage.vue';
import type { RecordDetail } from '@/interfaces/record.interface';
import FileViewer from '@/views/record/components/FileViewer.vue';

const { form } = defineProps({
    form: {
        type: Object as () => RecordDetail,
        required: true
    }
});

const state = reactive({
    activeTab: 0,
    activeTabChild: 0,
})
const isModalVisible = ref(false);
const currentDocumentUrl = ref<string>('');

const viewDocument = (index: number) => {
    if (form.documents) {
        currentDocumentUrl.value = form.documents[index].file;
        isModalVisible.value = true;
    }
};
</script>

<template>
    <UiParentCard title="Personal Details">
        <ProfileImage :url="form.profileImage" />
        <v-expansion-panels multiple>
            <!-- Step 1: Basic Personal Details -->
            <v-expansion-panel>
                <v-expansion-panel-title color="lightsecondary">Personal
                    Details</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-row dense>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">Name :
                            <span class="text-caption">{{ form.firstName }}</span>
                        </v-col>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">Last Name:
                            <span class="text-caption">{{ form.lastName }}</span>
                        </v-col>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">Email:
                            <span class="text-caption">{{ form.email }}</span>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">Mobile Number:
                            <span class="text-caption">{{ form.mobileNumber }}</span>
                        </v-col>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">WhatsApp Number:
                            <span class="text-caption">{{ form.whatsappNumber }}</span>
                        </v-col>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">Date of Birth:
                            <span class="text-caption">{{ form.dateOfBirth }}</span>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">Gender:
                            <span class="text-caption">{{ form.gender }}</span>
                        </v-col>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">House Name:
                            <span class="text-caption">{{ form.houseName }}</span>
                        </v-col>
                        <v-col class="text-h6" cols="12" sm="6" md="4" lg="3">House Number:
                            <span class="text-caption">{{ form.houseNumber }}</span>
                        </v-col>
                    </v-row>

                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Step 2: Sensitive Details -->
            <v-expansion-panel>
                <v-expansion-panel-title color="lightsecondary">Sensitive
                    Details</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-row dense>
                        <v-col sm="6" md="4" lg="6" class="text-h6" cols="4">Adhar Number:
                            <span class="text-caption">{{ form.aadhaarNumber }}</span>
                        </v-col>
                        <v-col sm="6" md="4" lg="6" class="text-h6" cols="4">Driving License:
                            <span class="text-caption">{{ form.drivingLicense }}</span>
                        </v-col>
                        <v-col sm="6" md="4" lg="6" class="text-h6" cols="4">Election ID:
                            <span class="text-caption">{{ form.electionID }}</span>
                        </v-col>
                        <v-col sm="6" md="4" lg="6" class="text-h6" cols="4">Passport Number:
                            <span class="text-caption">{{ form.passportNumber }}</span>
                        </v-col>

                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Step 3: Occupation & Address -->
            <v-expansion-panel>
                <v-expansion-panel-title color="lightsecondary">Occupation & Address
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-row dense>
                        <v-col>
                            <v-row class="pa-2" dense>
                                <v-col sm="6" md="4" lg="4" class="text-h6">Occupation:
                                    <span class="text-caption">{{ form.job }}</span>
                                </v-col>
                                <v-col sm="6" md="4" lg="4" class="text-h6">Retirement Date:
                                    <span class="text-caption">{{ form.retirementDate }}</span>
                                </v-col>

                            </v-row>
                        </v-col>

                        <v-col>
                            <v-row class="pa-2" dense>
                                <v-card v-if="form.addresses?.length">
                                    <v-tabs v-model="state.activeTab" bg-color="containerBg">
                                        <v-tab class="text-h6" v-for="(address, index) in form.addresses" :key="index"
                                            :value=index>
                                            Address {{ index + 1 }}
                                        </v-tab>
                                    </v-tabs>

                                    <v-card-text>
                                        <v-tabs-window v-model="state.activeTab">
                                            <v-tabs-window-item class="text-h6"
                                                v-for="(address, index) in form.addresses" :key="index" :value="index">
                                                <v-card-text>
                                                    <p class="text-h6">Street Name:
                                                        <span class="text-caption">{{ address.houseName
                                                            }}</span>
                                                    </p>
                                                    <p class="text-h6">Street Name:
                                                        <span class="text-caption">{{ address.streetName
                                                            }}</span>
                                                    </p>
                                                    <p class="text-h6">Village:
                                                        <span class="text-caption">{{ address.village
                                                            }}</span>
                                                    </p>

                                                </v-card-text>
                                            </v-tabs-window-item>
                                        </v-tabs-window>
                                    </v-card-text>
                                </v-card>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Step 4: Family Details -->
            <v-expansion-panel>
                <v-expansion-panel-title color="lightsecondary">Family Details</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-row dense>
                        <v-col>
                            <v-row class="pa-2" dense>
                                <v-col sm="6" md="4" lg="4" class="text-h6">
                                    Marriage Date: <span class="text-caption">{{ form.marriageDate
                                        }}</span>
                                </v-col>
                                <v-col sm="6" md="4" lg="4" class="text-h6">
                                    Previous Address: <span class="text-caption">{{
                                        form.previousAddress }}</span>
                                </v-col>
                            </v-row>

                        </v-col>


                        <v-col sm="6" md="4" lg="6">
                            <v-row class="pa-2" dense>
                                <v-card v-if="form.children?.length">
                                    <v-tabs v-model="state.activeTabChild" bg-color="containerBg">
                                        <v-tab class="text-h6" v-for="(address, index) in form.children" :key="index"
                                            :value=index>
                                            Child {{ index + 1 }}
                                        </v-tab>
                                    </v-tabs>

                                    <v-card-text>
                                        <v-tabs-window v-model="state.activeTabChild">
                                            <v-tabs-window-item class="text-h6" v-for="(child, index) in form.children"
                                                :key="index">
                                                <v-card-text>
                                                    <p class="text-h6">Name:
                                                        <span class="text-caption">{{ child.name
                                                            }}</span>
                                                    </p>
                                                    <p class="text-h6">DOB:
                                                        <span class="text-caption">{{ child.dateOfBirth
                                                            }}</span>
                                                    </p>
                                                    <p class="text-h6">Gender:
                                                        <span class="text-caption">{{ child.gender
                                                            }}</span>
                                                    </p>
                                                </v-card-text>
                                            </v-tabs-window-item>
                                        </v-tabs-window>
                                    </v-card-text>
                                </v-card>
                            </v-row>
                        </v-col>
                    </v-row>

                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Step 5: Policies -->
            <v-expansion-panel>
                <v-expansion-panel-title color="lightsecondary">
                    Policies</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-h6">#</th>
                                <th class="text-h6">Type</th>
                                <th class="text-h6">Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(policy, index) in form.policies" :key="index">
                                <td class="text-caption">{{ index + 1 }}</td>
                                <td class="text-caption">{{ policy.type }}</td>
                                <td class="text-caption">{{ policy.number }}</td>
                            </tr>
                            <tr v-if="!form.policies || form.policies.length === 0">
                                <td colspan="3" class="text-caption">No Policies available</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Step 6: Documents -->
            <v-expansion-panel>
                <v-expansion-panel-title color="lightsecondary">Documents </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-h6">#</th>
                                <th class="text-h6">Document Name</th>
                                <th class="text-h6">Attachment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(document, index) in form.documents" :key="index">
                                <td class="text-caption">{{ index + 1 }}</td>
                                <td class="text-caption">{{ document.name }}</td>
                                <td>
                                    <v-card-actions>
                                        <v-btn class="overlay" color="primary" @click="viewDocument(index)">
                                            View
                                            Document
                                        </v-btn>
                                    </v-card-actions>
                                </td>
                            </tr>
                            <tr v-if="!form.documents || form.documents.length === 0">
                                <td colspan="3" class="text-caption">No Documents available</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <FileViewer :isVisible="isModalVisible" :file="currentDocumentUrl || ''"
                @update:isVisible="isModalVisible = $event" />
        </v-expansion-panels>
    </UiParentCard>
</template>

<style lang="scss" scoped></style>