<template>
  <div class="position-relative">
    <div class="search-container">
      <v-text-field
        v-model="name"
        clearable
        hide-details
        label="Name or Nickname"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
      />
      <v-divider vertical />
      <FranchiseAutocomplete
        v-model="franchiseId!"
        clearable
        hide-details
        variant="solo"
      />
    </div>
    <v-fab
      v-if="roleLevel() <= 2"
      absolute
      class="floating-button"
      color="secondary"
      extended
      location="end"
      position="fixed"
      prepend-icon="mdi-plus"
      size="64"
      to="/waifus/new"
      z-index="10"
    />
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
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { WaifuList } from '@/interfaces/waifu'
  import api from '@/utils/axios.utils'
  import roleLevel from '@/plugins/role_level'

  const waifus = ref([] as WaifuList[])
  const page = ref(parseInt(router.currentRoute.value.query.page?.toString() ?? '1'))
  const name = ref(router.currentRoute.value.query.name?.toString() ?? '')
  const franchiseDefaultValue = parseInt(router.currentRoute.value.query.franchise?.toString() ?? '0')
  const franchiseId = ref(franchiseDefaultValue > 0 ? franchiseDefaultValue : null)
  const totalPages = ref(0)
  const loading = ref(false)
  const timeout = ref(null as any)

  interface GetWaifus {
    page: number;
    name?: string;
    franchise?: number | null;
  }

  onMounted(() => {
    loading.value = true
    getWaifus({ page: page.value, name: name.value, franchise: franchiseId.value })
  })

  // watches
  watch(page, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (timeout.value) clearTimeout(timeout.value)

      getWaifus({ page: newValue, name: name.value, franchise: franchiseId.value })
      router.push({ path: '/waifus', query: { page: newValue, name: name.value, franchise: franchiseId.value } })
    }
  })

  watch(name, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (timeout.value) clearTimeout(timeout.value)

      timeout.value = setTimeout(() => {
        page.value = 1
        getWaifus({ page: 1, name: newValue, franchise: franchiseId.value })
        router.push({ path: '/waifus', query: { page: 1, name: newValue, franchise: franchiseId.value } })
      }, 500)
    }
  })

  watch(franchiseId, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (timeout.value) clearTimeout(timeout.value)

      page.value = 1
      getWaifus({ page: page.value, name: name.value, franchise: newValue })
      router.push({ path: '/waifus', query: { page: 1, name: name.value, franchise: newValue } })
    }
  })

  // functions

  const getWaifus = async (params: GetWaifus) => {
    const url = `/waifus?page=${params.page ?? 1}&name=${params.name ?? ''}&franchise=${params.franchise ?? ''}`
    const { status, data } = await api.get(url)

    if (status === 200) {
      window.scrollTo(0, 0)
      waifus.value = data.waifus as WaifuList[]
      totalPages.value = data.total_pages
    }
    console.log(waifus.value)
    loading.value = false
  }
</script>
