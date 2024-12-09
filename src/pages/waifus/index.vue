<template>
  <div class="card-container">
    <WaifuCard
      v-for="waifu in waifus"
      :key="waifu.id"
      :data="waifu"
    />
  </div>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              class="my-4"
              :length="totalPages"
              smart="7"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { WaifuList } from '@/interfaces/waifu'
  import WaifuCard from '@/components/WaifuCard.vue'
  const waifus = ref([] as WaifuList[])
  const page = ref(parseInt(router.currentRoute.value.query.page?.toString() ?? '1'))
  const totalPages = ref(0)
  const loading = ref(false)
  const baseUrl = import.meta.env.VITE_BASE_URL_API

  interface GetWaifus {
    page?: number;
    name?: string;
  }

  onMounted(() => {
    loading.value = true
    console.log(import.meta.env.DEV)
    console.log(import.meta.env)
    getWaifus({ page: page.value })
  })

  // watches
  watch(page, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      getWaifus({ page: page.value })
      router.push({ path: '/waifus', query: { page: newValue } })
    }
  })

  const getWaifus = async (params: GetWaifus) => {
    const newLocal = `${baseUrl}/waifus?page=${params.page ?? 1}&name=${params.name ?? ''}`
    const response = await fetch(
      newLocal,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      window.scrollTo(0, 0)
      const values = await response.json()
      waifus.value = values.data.waifus as WaifuList[]
      totalPages.value = values.data.total_pages
    }
    console.log(waifus.value)
    loading.value = false
  }
</script>
