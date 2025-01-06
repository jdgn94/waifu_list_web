<template>
  <v-app-bar color="primary" :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon class="mobile-menu" @click="menu = true" />
    </template>

    <v-app-bar-title>Waifu List</v-app-bar-title>

    <v-spacer />

    <v-btn class="desktop-menu" to="/waifus">
      <span>Waifus</span>
    </v-btn>
    <v-btn class="desktop-menu">
      <span>Franchises</span>
    </v-btn>
    <v-btn class="desktop-menu">
      <span>Types</span>
    </v-btn>
    <v-btn class="desktop-menu">
      <span>Rarity</span>
    </v-btn>
    <v-divider vertical />
    <!-- log in visible if token == null -->
    <v-btn class="desktop-menu">
      <span>Log In</span>
    </v-btn>
    <!-- buttons visible if token != null -->
    <v-btn class="desktop-menu">
      <span>My List</span>
    </v-btn>
    <v-btn class="desktop-menu">
      <span>Favorite List</span>
    </v-btn>
    <v-btn class="desktop-menu">
      <span>Log Out</span>
    </v-btn>
  </v-app-bar>

  <v-bottom-sheet
    v-model="menu"
    close-on-content-click
    inset
    location-strategy="connected"
  >
    <v-card>
      <v-list>
        <v-list-item to="/waifus">
          <span>Waifus</span>
        </v-list-item>
        <v-list-item>
          <span>Franchises</span>
        </v-list-item>
        <v-list-item>
          <span>Types</span>
        </v-list-item>
        <v-list-item>
          <span>Rarity</span>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <span>Log In</span>
        </v-list-item>
        <v-list-item>
          <span>My List</span>
        </v-list-item>
        <v-list-item>
          <span>Favorite List</span>
        </v-list-item>
        <v-list-item>
          <span>Log Out</span>
        </v-list-item>
      </v-list>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts" setup>
  const token = ref(null) as Ref<string | null>
  const menu = ref(false)

  onMounted(() => {
    token.value = localStorage.getItem('token')
  })
</script>
