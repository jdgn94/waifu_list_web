<template>
  <div v-if="!loading && franchise.name != null && roleLevel() <= 2">
    <v-tabs
      v-model="tab"
      color="secondary"
      fixed-tabs
    >
      <v-tab text="Edit" :value="1" />
      <v-tab text="Info" :value="2" />
    </v-tabs>
    <v-tabs-window v-model="tab" class="mt-4">
      <v-tabs-window-item :value="1">
        <FranchiseForm :franchise="franchise" />
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <FranchiseInfo :franchise="franchise" />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
  <div v-if="!loading && franchise.name != null && roleLevel() >= 3">
    <FranchiseInfo :franchise="franchise" />
  </div>
  <Loading v-if="loading" />
</template>

<script lang="ts" setup>
  import { Franchise } from '@/interfaces/franchise'
  import router from '@/router'
  import api from '@/utils/axios.utils'
  import roleLevel from '@/plugins/role_level'

  const loading = ref(false)
  const id = ref(parseInt(router.currentRoute.value.params.id))
  const franchise = ref({} as Franchise)
  const tab = ref(1)

  onMounted(() => {
    if (!id.value) return router.back()
    getFranchise()
  })

  const getFranchise = async () => {
    loading.value = true
    console.log('get franchise')
    const { status, data } = await api.get(`/franchises/${id.value}`)

    if (status === 200) {
      console.log(data)
      franchise.value = data as Franchise
    }
    loading.value = false
  }
</script>
