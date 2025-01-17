<template>
  <v-autocomplete
    v-model="id"
    v-model:search="name"
    :item-title="filter"
    item-value="id"
    :items="franchises"
    label="Franchise"
    :loading="loading"
    :variant="variant"
    @click:clear="getFranchises"
  >
    <template #selection="{ item }">
      {{ (item.raw.name) + (item.raw.nickname ? ( ' - ' + item.raw.nickname) : '') }}
    </template>
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :subtitle="item.raw.nickname ?? ''"
        :title="item.raw.name"
      />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
  import { Franchise } from '@/interfaces/franchise'
  import api from '@/utils/axios.utils'
  import { VAutocomplete } from 'vuetify/components/VAutocomplete'

  const id = defineModel<number | null>()
  const name = ref('')
  const franchises = ref([] as Franchise[])
  const timeout = ref(null as any)
  const loading = ref(true)
  const propsComponent = defineProps({
    variant: VAutocomplete.props.variant,
    modelValue: { type: Number, default: null },
  })

  onMounted(() => {
    setTimeout(() => {
      console.log(propsComponent.modelValue)
      if (propsComponent.modelValue) {
        getFranchiseById()
      } else {
        getFranchises()
      }
    }, 200)
  })

  watch(name, (newValue, oldValue) => {
    if (newValue !== oldValue && !id.value) {
      loading.value = true
      if (timeout.value) clearTimeout(timeout.value)

      timeout.value = setTimeout(() => {
        getFranchises()
      }, 500)
    }
  })

  const getFranchises = async () => {
    const { status, data } = await api.get('/franchises?name=' + name.value)

    if (status === 200) {
      franchises.value = data.franchises
    }
    loading.value = false
  }

  const getFranchiseById = async () => {
    const { status, data } = await api.get('/franchises/' + id.value)

    if (status === 200) {
      franchises.value = [data] as Franchise[]
    }
    loading.value = false
  }

  const filter = (item: Franchise) => {
    if (item.nickname) if (RegExp(name.value, 'i').test(item.nickname)) return item.nickname
    if (RegExp(name.value, 'i').test(item.name)) return item.name
  }
</script>
