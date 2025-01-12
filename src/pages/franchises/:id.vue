<template>
  <div v-if="!loading">
    <v-text-field
      v-model="franchise.name"
      label="Name"
      :readonly="sessionStore.token == null"
    />
    <v-text-field
      v-model="franchise.nickname"
      label="Nickname"
      :readonly="sessionStore.token == null"
    />
    <v-text-field
      v-model="franchise.webPage"
      label="Web Page Reference"
      :readonly="sessionStore.token == null"
    />

    <!-- Images -->
    <div class="d-flex align-center justify-center">
      <div class="image-container-franchise">
        <v-icon v-if="sessionStore.token !== null" class="image-icon" icon="mdi-image" />
        <span
          v-if="sessionStore.token !== null"
          v-ripple
          class="image-input"
          @click="selectImage()"
        />
        <ImageRender
          :height="250"
          :image="urlImage()"
          :width="400"
        />
      </div>
      <v-file-input
        id="franchise-image"
        v-model="franchise.imageFile"
        accept="image/png, image/jpeg, image/bmp, image/webp"
        class="hide-element"
        :readonly="sessionStore.token == null"
        :rules="fileRules"
        show-size
      />
    </div>

    <v-btn
      v-if="sessionStore.token !== null"
      class="mt-5"
      color="primary"
      :loading="sendInfo"
      prepend-icon="mdi-content-save"
      text="Save"
      width="100%"
      @click="updateFranchise"
    />
  </div>
  <div v-else>
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </div>
</template>

<script lang="ts" setup>
  import { Franchise } from '@/interfaces/franchise'
  import router from '@/router'
  import { useSessionStore } from '@/stores/session'
  import api from '@/utils/axios.utils'
  import { VFileInput } from 'vuetify/components'

  const loading = ref(false)
  const id = ref(parseInt(router.currentRoute.value.params.id))
  const franchise = ref({} as Franchise)
  const sendInfo = ref(false)
  const sessionStore = useSessionStore()
  const fileRules = ref([
    (value: File[]) => {
      return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
    },
  ])

  onMounted(() => {
    if (!id.value) return router.back()
    getFranchise()
  })

  const getFranchise = async () => {
    loading.value = true
    console.log('get franchise')
    const { status, data } = await api.get(`/franchises/${id.value}`)

    if (status === 200) {
      console.log(data)
      franchise.value = data as Franchise
    }
    loading.value = false
  }

  const selectImage = () => {
    const input = window.document.getElementById(`franchise-image`) as VFileInput
    input.click()
  }

  const urlImage = () => {
    if (franchise.value.imageFile) {
      return URL.createObjectURL(franchise.value.imageFile)
    }
    if (franchise.value.publicUrl) {
      return franchise.value.publicUrl
    }
    return undefined
  }

  const updateFranchise = async () => {
    sendInfo.value = true
    const formData = new FormData()
    formData.append('name', franchise.value.name)
    formData.append('nickname', franchise.value.nickname ?? '')
    formData.append('web_page', franchise.value.webPage ?? '')
    if (franchise.value.imageFile) {
      formData.append('1', franchise.value.imageFile)
    }
    const { status } = await api.put(`/franchises/${id.value}`, formData)
    if (status === 200) {
      // router.push('/franchises')
    }
    sendInfo.value = false
  }
</script>
