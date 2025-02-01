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
    <v-btn class="desktop-menu" to="/franchises">
      <span>Franchises</span>
    </v-btn>
    <v-btn class="desktop-menu" to="/types">
      <span>Types</span>
    </v-btn>
    <v-btn class="desktop-menu">
      <span>Rarity</span>
    </v-btn>
    <v-divider vertical />
    <!-- log in visible if token == null -->
    <v-btn v-if="!token" class="desktop-menu" @click="loginDialog = true">
      <span>Log In</span>
    </v-btn>
    <!-- buttons visible if token != null -->
    <v-btn v-if="token" class="desktop-menu">
      <span>My List</span>
    </v-btn>
    <v-btn v-if="token" class="desktop-menu">
      <span>Favorite List</span>
    </v-btn>
    <v-btn v-if="token" class="desktop-menu" @click="logout">
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
        <v-list-item to="/franchises">
          <span>Franchises</span>
        </v-list-item>
        <v-list-item to="/types">
          <span>Types</span>
        </v-list-item>
        <v-list-item>
          <span>Rarity</span>
        </v-list-item>
        <v-divider />
        <v-list-item v-if="!token" @click="openDialog">
          <span>Log In</span>
        </v-list-item>
        <v-list-item v-if="token">
          <span>My List</span>
        </v-list-item>
        <v-list-item v-if="token">
          <span>Favorite List</span>
        </v-list-item>
        <v-list-item v-if="token" @click="logout">
          <span>Log Out</span>
        </v-list-item>
      </v-list>
    </v-card>
  </v-bottom-sheet>

  <v-dialog v-model="loginDialog" max-width="500">
    <v-card class="pa-4">
      <v-card-title class="d-flex">
        Log In
        <v-spacer />
        <v-icon color="error" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-text-field
        v-model="telegramId"
        hide-details
        label="Telegram id"
        :loading="loading"
        name="username"
        @keydown.enter="login"
      />
      <v-card-actions>
        <v-btn
          color="success"
          :loading="loading"
          variant="elevated"
          @click="login"
        >
          Log In
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useSessionStore } from '@/stores/session'
  import api, { removeHeaderAuth, setHeaderAuth } from '@/utils/axios.utils'

  const token = ref(null) as Ref<string | null>
  const menu = ref(false)
  const loading = ref(false)
  const loginDialog = ref(false)
  const telegramId = ref('')
  const sessionStore = useSessionStore()

  onMounted(() => {
    token.value = localStorage.getItem('token')
    if (token.value) getUserInfo()
  })

  const openDialog = () => {
    loginDialog.value = true
  }

  const closeDialog = () => {
    loginDialog.value = false
    telegramId.value = ''
  }

  const login = async () => {
    loading.value = true
    const response = await api.post('/session/login', {
      id: telegramId.value,
    })

    if (response.status === 200) {
      const values = await response.data
      localStorage.setItem('token', values.token)
      token.value = values.token
      setHeaderAuth(token.value!)
      sessionStore.create(
        values.user.username,
        values.user.nickname,
        values.user.role.name,
        values.user.userInfo,
        values.token
      )
      closeDialog()
    }
    loading.value = false
  }

  const logout = () => {
    localStorage.removeItem('token')
    removeHeaderAuth()
    sessionStore.reset()
    token.value = null
  }

  const getUserInfo = async () => {
    setHeaderAuth(token.value!)
    const response = await api.get('/session')
    if (response.status === 200) {
      const values = response.data
      sessionStore.create(
        values.user.username,
        values.user.nickname,
        values.user.role.name,
        values.user.userInfo,
        token.value!
      )
    } else {
      localStorage.removeItem('token')
      token.value = null
    }
  }
</script>
