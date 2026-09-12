<script setup lang="ts">
import { useValidation } from '@/composables/useValidation';
import { COUNTRY_NAMES } from '@/utils/countries';

const addressLine1 = defineModel<string>('addressLine1', { default: '' });
const addressLine2 = defineModel<string>('addressLine2', { default: '' });
const city = defineModel<string>('city', { default: '' });
const state = defineModel<string>('state', { default: '' });
const postalCode = defineModel<string>('postalCode', { default: '' });
const country = defineModel<string>('country', { default: '' });

const validationRules = useValidation();
const countryNames = COUNTRY_NAMES;
</script>

<template>
    <v-row>
        <v-col cols="12" sm="6">
            <v-text-field variant="outlined" v-model="addressLine1" label="Address Line 1" />
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field variant="outlined" v-model="addressLine2" label="Address Line 2" />
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field variant="outlined" v-model="city" label="City" />
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field variant="outlined" v-model="state" label="State / Region" />
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field variant="outlined" v-model="postalCode" label="Postal Code"
                :rules="[validationRules.postalCode]" />
        </v-col>
        <v-col cols="12" sm="6">
            <v-autocomplete variant="outlined" v-model="country" :items="countryNames" label="Country" clearable
                :rules="[validationRules.country]" />
        </v-col>
    </v-row>
</template>
