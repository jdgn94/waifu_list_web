<template>
  <div class="position-relative">
    <div class="search-container">
      <v-text-field
        v-model="name"
        clearable
        hide-details
        label="Name"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        @update:model-value="getFranchises"
      />
    </div>
    <v-fab
      v-if="sessionStore.token"
      absolute
      class="floating-button"
      color="secondary"
      extended
      location="end"
      position="fixed"
      prepend-icon="mdi-plus"
      size="64"
      to="/franchises/new"
      z-index="10"
    />
    <div v-if="!loading">
      <div v-if="franchises.length > 0" class="card-container">
        <FranchiseCard
          v-for="franchise in franchises"
          :key="franchise.id"
          :data="franchise"
        />
      </div>
      <div v-else>
        <h2>No franchises found</h2>
      </div>
    </div>
    <div v-else class="card-container">
      <CardLoading
        v-for="index in 20"
        :key="index"
        :height-image="150"
        :image="true"
        :subtitle="true"
        :title="true"
        :width="250"
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
  import { Franchise } from '@/interfaces/franchise'
  import router from '@/router'
  import { useSessionStore } from '@/stores/session'
  import api from '@/utils/axios.utils'

  const page = ref(parseInt(router.currentRoute.value.query.page?.toString() ?? '1'))
  const name = ref(router.currentRoute.value.query.name?.toString() ?? '')
  const franchises = ref([] as Franchise[])
  const totalPages = ref(0)
  const timeout = ref(null as any)
  const loading = ref(false)
  const sessionStore = useSessionStore()

  onMounted(() => {
    getFranchises()
  })

  // watches
  watch(page, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (timeout.value) clearTimeout(timeout.value)

      getFranchises()
      router.push({ path: '/franchises', query: { page: newValue, name: name.value } })
    }
  })

  watch(name, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (timeout.value) clearTimeout(timeout.value)

      timeout.value = setTimeout(() => {
        page.value = 1
        getFranchises()
        router.push({ path: '/franchises', query: { page: 1, name: newValue } })
      }, 500)
    }
  })

  // methods
  const getFranchises = async () => {
    loading.value = true
    const url = `/franchises?page=${page.value}&name=${name.value}`
    const { status, data } = await api.get(url)

    if (status === 200) {
      window.scrollTo(0, 0)
      franchises.value = data.franchises as Franchise[]
      totalPages.value = data.total_pages
    }
    loading.value = false
  }
</script>
