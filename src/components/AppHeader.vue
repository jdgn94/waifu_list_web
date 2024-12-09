<template>
  <v-app-bar color="primary" :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon />
    </template>

    <v-app-bar-title>Waifu List</v-app-bar-title>

    <v-spacer />

    <v-btn to="/waifus">
      <span>Waifus</span>
    </v-btn>
    <v-btn>
      <span>Franchises</span>
    </v-btn>
    <v-btn>
      <span>Types</span>
    </v-btn>
    <v-btn>
      <span>Rarity</span>
    </v-btn>
    <v-divider vertical />
    <!-- log in visible if token == null -->
    <v-btn>
      <span>Log In</span>
    </v-btn>
    <!-- buttons visible if token != null -->
    <v-btn>
      <span>My List</span>
    </v-btn>
    <v-btn>
      <span>Favorite List</span>
    </v-btn>
    <v-btn>
      <span>Log Out</span>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
  const token = ref(null) as Ref<string | null>

  onMounted(() => {
    token.value = localStorage.getItem('token')
  })
</script>
