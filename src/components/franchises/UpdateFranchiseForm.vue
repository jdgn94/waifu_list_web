<template>
  <v-text-field
    v-model="franchise!.name"
    label="Name"
  />
  <v-text-field
    v-model="franchise!.nickname"
    label="Nickname"
  />
  <v-text-field
    v-model="franchise!.webPage"
    label="Web Page Reference"
  />

  <!-- Images -->
  <div class="d-flex align-center justify-center">
    <div class="image-container-franchise">
      <v-icon class="image-icon" icon="mdi-image" />
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
      v-model="franchise!.imageFile"
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
    text="Save"
    width="100%"
    @click="updateFranchise"
  />
</template>

<script lang="ts" setup>
  import { Franchise } from '@/interfaces/franchise'
  import router from '@/router'
  import api from '@/utils/axios.utils'
  import { VFileInput } from 'vuetify/components'

  const sendInfo = ref(false)
  const fileRules = ref([
    (value: File[]) => {
      return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
    },
  ])
  const props = defineProps({
    franchise: { type: Object as () => Franchise, require: true },
  })

  const selectImage = () => {
    const input = window.document.getElementById(`franchise-image`) as VFileInput
    input.click()
  }

  const urlImage = () => {
    if (props.franchise!.imageFile) {
      return URL.createObjectURL(props.franchise!.imageFile)
    }
    if (props.franchise!.publicUrl) {
      return props.franchise!.publicUrl
    }
    return undefined
  }

  const updateFranchise = async () => {
    sendInfo.value = true
    const formData = new FormData()
    formData.append('name', props.franchise!.name)
    formData.append('nickname', props.franchise!.nickname ?? '')
    formData.append('web_page', props.franchise!.webPage ?? '')
    if (props.franchise!.imageFile) {
      formData.append('1', props.franchise!.imageFile)
    }
    const { status } = await api.put(`/franchises/${props.franchise!.id}`, formData)
    if (status === 200) {
      router.push('/franchises')
    }
    sendInfo.value = false
  }
</script>
