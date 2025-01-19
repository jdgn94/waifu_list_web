<template>
  <v-card
    class="my-2 mx-2"
    style="max-width: 250px;"
    :to="'/franchises/' + data!.id"
  >
    <v-overlay opacity=".06" scrim="primary" />
    <ImageRender :height="200" :image="data!.publicUrl ?? undefined" :width="250" />
    <h3 class="pl-2 pr-2">
      {{ data!.name }}
    </h3>
    <h4 class="pl-2 pr-2 mb-2">
      {{ data!.nickname }}
    </h4>
  </v-card>
</template>

<script setup lang="ts">
  import { Franchise } from '@/interfaces/franchise'
  defineProps({
    data: Object as () => Franchise,
  })
</script>
