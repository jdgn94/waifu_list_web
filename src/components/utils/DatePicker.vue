<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="dateFormate"
        v-bind="props"
        append-inner-icon="mdi-calendar"
        :color="p.color"
        :error-messages="p.error"
        :label="p.label"
        :max-width="p.maxWidth"
        readonly
      />
    </template>

    <v-card :max-width="450">
      <v-date-picker
        v-model="dateSelected"
        :color="p.color"
        :max="p.maxDate ? format(p.maxDate, 'YYYY-MM-DD') : ''"
        :min="p.minDate ? format(p.minDate, 'YYYY-MM-DD') : ''"
        width="100%"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click="confirm">OK</v-btn>
        <v-btn color="error" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
  import { format } from '@formkit/tempo'

  const menu = ref(false)
  const dateFormate = ref('')
  const date = defineModel({ type: Date, default: null })
  const dateSelected = ref(date.value)
  const p = defineProps({
    setDate: { type: Function, required: true },
    label: { type: String, default: '' },
    color: { type: String, default: 'primary' },
    maxWidth: { type: String, default: '' },
    maxDate: { type: Date, default: '' },
    minDate: { type: Date, default: '' },
    error: { type: String, default: '' },
    defaultValue: { type: Date, default: undefined },
  })

  onMounted(() => {
    if (p.defaultValue) {
      date.value = p.defaultValue.toISOString()
    }
  })

  watch(date, (newValue: string) => {
    dateFormate.value = newValue ? format(newValue, 'YYYY/MM/DD') : ''
  })

  const confirm = () => {
    date.value = dateSelected.value
    p.setDate(date.value)
    menu.value = false
  }

  const cancel = () => {
    dateSelected.value = date.value
    menu.value = false
  }
</script>
