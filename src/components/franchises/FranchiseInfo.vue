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
</template>

<script setup lang="ts">
  import { Franchise } from '@/interfaces/franchise'

  const props = defineProps({
    franchise: { type: Object as () => Franchise, required: true },
  })

  onMounted(() => {
    console.log(props.franchise)
    // TODO: crear la función para buscar a las waifus
  })
</script>
