<template>
  <v-text-field
    v-model="name"
    label="Name"
    :readonly="sessionStore.token == null"
  />
  <v-text-field
    v-model="nickname"
    label="Nickname"
    :readonly="sessionStore.token == null"
  />
  <v-text-field
    v-model="webPage"
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
      v-model="imageFile"
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
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { useSessionStore } from '@/stores/session'
  import api from '@/utils/axios.utils'
  import { VFileInput } from 'vuetify/components'

  const name = ref('')
  const nickname = ref('')
  const webPage = ref('')
  const imageFile = ref(null as File | null)
  const sendInfo = ref(false)
  const sessionStore = useSessionStore()
  const fileRules = ref([
    (value: File[]) => {
      return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
    },
  ])

  onMounted(() => {
    if (sessionStore.token == null) router.replace('/')
    window.scrollTo(0, 0)
  })

  const selectImage = () => {
    const input = window.document.getElementById(`franchise-image`) as VFileInput
    input.click()
  }

  const urlImage = () => {
    if (imageFile.value) {
      return URL.createObjectURL(imageFile.value)
    }
    return undefined
  }

  const updateFranchise = async () => {
    sendInfo.value = true
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('nickname', nickname.value ?? '')
    formData.append('web_page', webPage.value ?? '')
    if (imageFile.value) {
      formData.append('1', imageFile.value)
    }
    const { status } = await api.post('/franchises', formData)
    if (status === 200) {
      router.push('/franchises')
    }
    sendInfo.value = false
  }
</script>
