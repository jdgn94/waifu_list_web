<template>
  <v-card class="my-2 mx-2" :width="width ?? 250">
    <v-skeleton-loader v-if="image" class="px-0 py-0 h-3" :min-height="heightImage ?? 200" type="image" />
    <v-skeleton-loader v-if="title" type="sentences" />
    <v-skeleton-loader v-if="subtitle" type="text" />
  </v-card>
  <!-- <v-skeleton-loader class="my-2 mx-2" type="image, sentences, text" :width="width ?? 250" /> -->
</template>

<script setup lang="ts">
  defineProps({
    image: Boolean,
    title: Boolean,
    subtitle: Boolean,
    width: Number,
    heightImage: Number,
  })
</script>
