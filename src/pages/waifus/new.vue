<template>
  <v-text-field
    v-model="name"
    label="Name"
    type="text"
  />
  <v-text-field
    v-model="nickname"
    label="Nickname"
    type="text"
  />
  <v-text-field
    v-model="age"
    label="Age"
    type="number"
  />
  <FranchiseAutocomplete
    v-model="franchiseId"
  />
  <v-autocomplete
    v-model="typeId"
    item-title="name"
    item-value="id"
    :items="waifuTypes"
    label="Type"
  />

  <!-- Images -->
  <div class="images-container">
    <v-card
      v-for="(waifuImage, index) in waifuImages"
      :key="waifuImage.id"
      class="my-2 mx-2"
      style="max-width: 250px;"
    >
      <v-overlay opacity=".06" scrim="primary" />
      <div class="image-container">
        <v-btn
          v-if="waifuImage.id == 0"
          class="image-delete"
          color="red"
          icon="mdi-close"
          @click="deleteImage(index)"
        />
        <v-icon :class="currentTheme == 'dark' ? 'image-icon-dark' : 'image-icon-light'" icon="mdi-image" />
        <div
          v-ripple
          class="image-input"
          @click="selectImage(index)"
        />
        <ImageRender
          :height="400"
          :image="_urlImage(waifuImage)"
          :width="250"
        />
      </div>
      <div style="height: 10px" />
      <v-file-input
        :id="'imageFileIndex' + index"
        v-model="waifuImage.imageFile"
        accept="image/png, image/jpeg, image/bmp"
        class="hide-element"
        :rules="fileRules"
        show-size
      />
      <v-autocomplete
        v-model="waifuImage.imageTypeId"
        item-title="name"
        item-value="id"
        :items="imageTypes"
        label="Type"
      >
        <template #selection="{ item }">
          {{ (item.raw.icon ?? '') + ' ' + item.raw.name }}
        </template>
        <template #item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="(item.raw.icon ?? 'ㅤ') + ' ' + item.raw.name"
          />
        </template>
      </v-autocomplete>
      <v-autocomplete
        v-model="waifuImage.rarityId"
        item-title="name"
        item-value="id"
        :items="waifuRarities"
        label="Rarity"
      >
        <template #selection="{ item }">
          {{ (item.raw.icon ?? '') + ' ' + item.raw.name }}
        </template>
        <template #item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="(item.raw.icon ?? '') + ' ' + item.raw.name"
          />
        </template>
      </v-autocomplete>
      <v-text-field
        v-model="waifuImage.points"
        label="Points"
        type="number"
      />
    </v-card>
    <v-btn
      class="my-2 mx-2"
      height="auto"
      min-height="644"
      width="250"
      @click="addImage"
    >
      <v-icon>mdi-plus</v-icon>
      <span>Add Image</span>
    </v-btn>
  </div>

  <v-btn
    class="mt-5"
    color="primary"
    :loading="sendInfo"
    prepend-icon="mdi-content-save"
    text="Create"
    width="100%"
    @click="createWaifu"
  />
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { Franchise } from '@/interfaces/franchise'
  import { WaifuType } from '@/interfaces/waifu_type'
  import { ImageType } from '@/interfaces/image_type'
  import { WaifuRarity } from '@/interfaces/waifu_rarity'
  import { WaifuImage } from '@/interfaces/waifu_image'
  import { VFileInput } from 'vuetify/components'
  import { useSessionStore } from '@/stores/session'
  import api from '@/utils/axios.utils'
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const currentTheme = theme.global.name
  const id = ref(0)
  const franchises = ref([] as Franchise[])
  const waifuTypes = ref([] as WaifuType[])
  const imageTypes = ref([] as unknown as ImageType[])
  const waifuRarities = ref([] as WaifuRarity[])
  const waifuImages = ref([] as WaifuImage[])
  const name = ref('')
  const nickname = ref('')
  const age = ref(undefined as number | undefined)
  const franchiseId = ref(undefined as number | undefined)
  const typeId = ref(undefined as number | undefined)
  const sendInfo = ref(false)
  const sessionStore = useSessionStore()
  const fileRules = ref([
    (value: File[]) => {
      return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
    },
  ])

  onMounted(() => {
    if (sessionStore.token == null) return router.replace('/')
    window.scrollTo(0, 0)
    findFranchises()
    findWaifuTypes()
    findWaifuRarities()
    findImageTypes()
  })

  const findFranchises = async () => {
    const url = `/franchises`
    const { status, data } = await api.get(url)
    if (status === 200) {
      franchises.value = data as Franchise[]
    }
  }

  const findWaifuTypes = async () => {
    const url = `/waifu_types`
    const { status, data } = await api.get(url)
    if (status === 200) {
      waifuTypes.value = data as WaifuType[]
    }
  }

  const findWaifuRarities = async () => {
    const url = `/waifu_rarities`
    const { status, data } = await api.get(url)
    if (status === 200) {
      waifuRarities.value = data as WaifuRarity[]
    }
  }

  const findImageTypes = async () => {
    const url = `/image_types?specials=false`
    const { status, data } = await api.get(url)
    if (status === 200) {
      imageTypes.value = data as ImageType[]
    }
  }

  const _urlImage = (waifuImage: WaifuImage) => {
    if (waifuImage.imageFile) {
      return URL.createObjectURL(waifuImage.imageFile)
    }
    if (waifuImage.publicUrl) {
      return waifuImage.publicUrl
    }
    return undefined
  }

  const addImage = () => {
    const newWaifuImage: WaifuImage = {
      id: 0,
      publicId: '0',
      publicUrl: '',
      waifuId: id.value,
      imageTypeId: 1,
      rarityId: 1,
      points: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    waifuImages.value.push(newWaifuImage)
  }

  const deleteImage = (index: number) => {
    waifuImages.value.splice(index, 1)
  }

  const selectImage = async (index: number) => {
    const input = window.document.getElementById(`imageFileIndex${index}`) as VFileInput
    input.click()
  }

  const createWaifu = async () => {
    sendInfo.value = true
    const url = `/waifus`
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('nickname', nickname.value)
    formData.append('age', age.value?.toString() ?? '0')
    formData.append('franchise_id', franchiseId.value!.toString())
    formData.append('type_id', typeId.value!.toString())
    const images = waifuImages.value.map(waifuImage => {
      formData.append(waifuImage.imageTypeId.toString(), waifuImage.imageFile!)
      return {
        image_type_id: waifuImage.imageTypeId,
        rarity_id: waifuImage.rarityId,
        points: waifuImage.points,
      }
    })
    formData.append('images', JSON.stringify(images))
    console.log(formData)
    // const response = await fetch(
    //   url,
    //   {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${sessionStore.token}`,
    //       'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryBODBNK9vWWeDNOP1',
    //     },
    //     body: formData,
    //   }
    // )
    const { status, data, statusText } = await api.post(url, formData)
    console.log(statusText)
    console.log(data)
    sendInfo.value = false
    if (status === 200) {
      console.log('updated')
      // router.back()
    } else {
      console.error(data)
    }
  }
</script>
