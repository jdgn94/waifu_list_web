<template>
  <v-app class="relative">
    <ButtonChangeTheme />
    <AppHeader />
    <v-container>
      <v-main>
        <router-view />
      </v-main>
    </v-container>
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
</script>
