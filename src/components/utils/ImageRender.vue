<template>
  <v-img
    aspect-ratio="1"
    cover
    :height="height ?? 300"
    :lazy-src="image?.replaceAll('upload/', 'upload/w_50/e_blur/q_auto/f_auto/')"
    :max-height="height ?? 300"
    :max-width="width ?? 200"
    :src="image ?? '/assets/image-no-found.webp'"
    :width="width ?? 200"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <Loading />
      </div>
    </template>
  </v-img>
</template>

<script setup lang="ts">
  defineProps({ image: String || null, width: Number, height: Number })
</script>
