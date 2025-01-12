<template>
  <div class="mt-7">
    <p class="mt-7">{{ error.statusCode }}</p>
    <p>Hola vale</p>
  </div>
</template>

<script setup lang="ts">
  // import router from '@/router'

  defineProps(['error'])

  // const goBack = () => {
  //   router.push('/')
  // }
</script>
