<template>
  <v-text-field
    v-model="name"
    label="Name"
  />
  <v-text-field
    v-model="nickname"
    label="Nickname"
  />
  <v-text-field
    v-model="webPage"
    label="Web Page Reference"
  />

  <!-- Images -->
  <div class="d-flex align-center justify-center">
    <div class="image-container-franchise">
      <v-icon :class="currentTheme == 'dark' ? 'image-icon-dark' : 'image-icon-light'" icon="mdi-image" />
      <span
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
      :rules="fileRules"
      show-size
    />
  </div>

  <v-btn
    class="mt-5"
    color="primary"
    :loading="sendInfo"
    prepend-icon="mdi-content-save"
    :text="edit ? 'Update' : 'Create'"
    width="100%"
    @click="updateFranchise"
  />
</template>

<script lang="ts" setup>
  import { Franchise } from '@/interfaces/franchise'
  import router from '@/router'
  import api from '@/utils/axios.utils'
  import { useTheme } from 'vuetify'
  import { VFileInput } from 'vuetify/components'

  const theme = useTheme()
  const currentTheme = theme.global.name
  const name = ref('')
  const nickname = ref('')
  const webPage = ref('')
  const publicUrl = ref('')
  const imageFile = ref(null as File | null)
  const sendInfo = ref(false)
  const edit = ref(false)
  const fileRules = ref([
    (value: File[]) => {
      return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
    },
  ])
  const props = defineProps({
    franchise: { type: Object as () => Franchise, require: false },
  })

  onMounted(() => {
    if (props.franchise) {
      edit.value = true
      name.value = props.franchise.name
      nickname.value = props.franchise.nickname ?? ''
      webPage.value = props.franchise.webPage ?? ''
      publicUrl.value = props.franchise.publicUrl ?? ''
    }
  })

  const selectImage = () => {
    const input = window.document.getElementById(`franchise-image`) as VFileInput
    input.click()
  }

  const urlImage = () => {
    if (imageFile.value) {
      return URL.createObjectURL(imageFile.value)
    }
    if (publicUrl.value) {
      return publicUrl.value
    }
    return undefined
  }

  const updateFranchise = async () => {
    sendInfo.value = true
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('nickname', nickname.value)
    formData.append('web_page', webPage.value)
    if (imageFile.value) {
      formData.append('1', imageFile.value)
    }
    const { status } = await api.put(`/franchises/${edit.value ? props.franchise!.id : ''}`, formData)
    if (status === 200) {
      router.push('/franchises')
    }
    sendInfo.value = false
  }
</script>
