<script setup lang="ts">
import { useValidation } from '@/composables/useValidation';
import { COUNTRY_NAMES } from '@/utils/countries';

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });

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
        <v-col :cols="12" :sm="compact ? 6 : undefined" :lg="compact ? 4 : undefined">
            <v-text-field variant="outlined" v-model="addressLine1" label="Address Line 1" hide-details="auto" />
        </v-col>
        <v-col :cols="12" :sm="compact ? 6 : undefined" :lg="compact ? 4 : undefined">
            <v-text-field variant="outlined" v-model="addressLine2" label="Address Line 2"
                placeholder="Apartment, floor (optional)" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6" :lg="compact ? 4 : 3">
            <v-text-field variant="outlined" v-model="city" label="City" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6" :lg="compact ? 4 : 3">
            <v-text-field variant="outlined" v-model="state" label="State / Region" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6" :lg="compact ? 4 : 3">
            <v-text-field variant="outlined" v-model="postalCode" label="Postal Code"
                :rules="[validationRules.postalCode]" hide-details="auto" />
        </v-col>
        <v-col cols="12" sm="6" :lg="compact ? 4 : 3">
            <v-autocomplete variant="outlined" v-model="country" :items="countryNames" label="Country" clearable
                :rules="[validationRules.country]" hide-details="auto" />
        </v-col>
    </v-row>
</template>
