<template>
  <div v-if="waifu.name != null &&!loading && roleLevel() <= 2">
    <UpdateWaifuForm :waifu="waifu" />
  </div>
  <div v-if="waifu.name != null && !loading && roleLevel() >= 3">
    <WaifuInfo :waifu="waifu" />
  </div>
  <div v-if="waifu.name == null && !loading">
    <h2>Waifu not found</h2>
  </div>
  <div v-if="loading" class="center-element">
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { Waifu } from '@/interfaces/waifu'
  import { useSessionStore } from '@/stores/session'
  import api from '@/utils/axios.utils'
  import roleLevel from '@/plugins/role_level'

  const loading = ref(false)
  const id = ref(parseInt(router.currentRoute.value.params.id))
  const waifu = ref({} as Waifu)
  const sessionStore = useSessionStore()

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
