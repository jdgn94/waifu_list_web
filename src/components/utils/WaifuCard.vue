<template>
  <v-card
    class="my-2 mx-2"
    style="max-width: 200px;"
    :to="'/waifus/' + data!.waifu.id"
  >
    <v-overlay opacity=".06" scrim="primary" />
    <ImageRender :image="data!.publicUrl" />
    <h3 class="pl-2 pr-2">
      {{ data!.waifu.name }}
    </h3>
    <h4 v-if="!disableFranchise" class="pl-2 pr-2">{{ data!.waifu.franchise.name }}</h4>
  </v-card>
</template>

<script setup lang="ts">
  import { WaifuList } from '@/interfaces/waifu'

  defineProps({
    data: Object as () => WaifuList,
    disableFranchise: { type: Boolean, default: false },
  })
</script>
