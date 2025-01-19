<template>
  <span class="change-theme">
    <v-btn
      color="secondary"
      density="default"
      height="70"
      variant="flat"
      @click="changeTheme"
    >
      <span class="bnt-column">
        <span>
          <v-icon size="30">
            {{
              themeInUse == 'light'
                ?'mdi-weather-sunny'
                : themeInUse == 'dark'
                  ? 'mdi-moon-waxing-crescent'
                  : 'mdi-theme-light-dark'
            }}
          </v-icon>
        </span>
        <span class="mt-2">
          {{ themeInUse }}
        </span>
      </span>
    </v-btn>
  </span>
</template>

<script setup lang="ts">
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const themeInUse = ref('')

  onMounted(() => {
    themeInUse.value = localStorage.getItem('theme') || 'light'
    setTheme()
  })

  watch(theme, () => {
    if (themeInUse.value === 'system') {
      if (theme.computedThemes.value.dark.dark === true) {
        theme.global.name.value = 'dark'
      } else {
        theme.global.name.value = 'light'
      }
    }
  })

  const setTheme = () => {
    if (themeInUse.value === 'system') {
      if (theme.computedThemes.value.dark.dark === true) {
        theme.global.name.value = 'dark'
      } else {
        theme.global.name.value = 'light'
      }
    } else {
      theme.global.name.value = themeInUse.value
    }
  }

  const changeTheme = () => {
    // if (themeInUse.value === 'system') {
    //   themeInUse.value = 'light'
    // } else if (themeInUse.value === 'light') {
    //   themeInUse.value = 'dark'
    // } else {
    //   themeInUse.value = 'system'
    // }

    if (themeInUse.value === 'light') {
      themeInUse.value = 'dark'
    } else {
      themeInUse.value = 'light'
    }
    localStorage.setItem('theme', themeInUse.value)
    setTheme()
  }
</script>
