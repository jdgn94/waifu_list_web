<template>
  <div v-if="waifu.name != null &&!loading && roleLevel() <= 2">
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
        <WaifuForm :waifu="waifu" />
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <WaifuInfo :waifu="waifu" />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
  <div v-if="waifu.name != null && !loading && roleLevel() >= 3">
    <WaifuInfo :waifu="waifu" />
  </div>
  <div v-if="waifu.name == null && !loading">
    <h2>Waifu not found</h2>
  </div>
  <Loading v-if="loading" />
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { Waifu } from '@/interfaces/waifu'
  import api from '@/utils/axios.utils'
  import roleLevel from '@/plugins/role_level'

  const loading = ref(false)
  const id = ref(parseInt(router.currentRoute.value.params.id))
  const waifu = ref({} as Waifu)
  const tab = ref(1)

  onMounted(() => {
    if (!id.value) return router.back()
    window.scrollTo(0, 0)
    findWaifu()
  })

  const findWaifu = async () => {
    loading.value = true
    const url = `/waifus/${id.value}`
    const { status, data } = await api.get(url)

    if (status === 200) {
      waifu.value = data as Waifu
    }
    loading.value = false
  }
</script>
