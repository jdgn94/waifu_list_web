<template>
  <v-card class="d-flex flex-row maks-3">
    <ImageRender
      :height="250"
      :image="props.franchise!.publicUrl ?? undefined"
      :width="400"
    />
    <div class="mx-3">
      <h1>Name: {{ props.franchise!.name }}</h1>
      <h2>Nickname: {{ props.franchise!.nickname }}</h2>
      <br>
      <h2>
        <a class="link" :href="props.franchise!.webPage ?? '#'">
          Web Page
          <v-icon icon="mdi-web" size="small" />
        </a>
      </h2>
    </div>
  </v-card>

  <h1 class="my-5">Related waifus</h1>

  <div class="images-container">
    <WaifuCard
      v-for="waifu in waifus"
      :key="waifu.id"
      :data="waifu"
      :disable-franchise="true"
    />

    <h1 v-if="waifus.length == 0 && !loading" class="text-center w-100">No waifus</h1>
    <Loading v-if="loading" />
  </div>
</template>

<script setup lang="ts">
  import { Franchise } from '@/interfaces/franchise'
  import { WaifuList } from '@/interfaces/waifu'
  import api from '@/utils/axios.utils'

  const waifus = ref([] as WaifuList[])
  const loading = ref(true)

  const props = defineProps({
    franchise: { type: Object as () => Franchise, required: true },
  })

  onMounted(() => {
    getWaifus()
  })

  const getWaifus = async () => {
    const url = `/waifus?franchise=${props.franchise!.id}`
    const { status, data } = await api.get(url)
    if (status === 200) {
      waifus.value = data.waifus as WaifuList[]
    }
    loading.value = false
  }
</script>
