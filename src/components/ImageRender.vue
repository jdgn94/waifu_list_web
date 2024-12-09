<template>
  <v-img
    aspect-ratio="1"
    cover
    :height="height ?? 300"
    :lazy-src="image!.replaceAll('upload/', 'upload/w_50/e_blur/q_auto/f_auto/')"
    :src="image"
    :width="width ?? 200"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </div>
    </template>
  </v-img>
</template>

<script setup lang="ts">
  defineProps({ image: String, width: Number, height: Number })
</script>
