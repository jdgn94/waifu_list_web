<template>
  <div v-if="waifu.name != null || loading == true">
    <v-text-field
      v-model="waifu.name"
      label="Name"
      type="text"
    />
    <v-text-field
      v-model="waifu.nickname"
      label="Nickname"
      type="text"
    />
    <v-text-field
      v-model="waifu.age"
      label="Age"
      type="number"
    />
    <v-autocomplete
      v-model="waifu.franchiseId"
      item-title="name"
      item-value="id"
      :items="franchises"
      label="Franchise"
    />
    <v-autocomplete
      v-model="waifu.typeId"
      item-title="name"
      item-value="id"
      :items="waifuTypes"
      label="Type"
    />

    <!-- Images -->
    <div class="images-container">
      <v-card
        v-for="(waifuImage, index) in waifu.waifuImages"
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
          <v-icon class="image-icon" icon="mdi-image" />
          <div
            v-ripple
            class="image-input"
            @click="selectImage(index)"
          />
          <ImageRender
            :height="400"
            :image="waifuImage!.publicUrl"
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
          v-model="waifuImage.ImageTypeId"
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
      <v-btn class="my-2 mx-2" height="auto" width="250" @click="addImage">
        <v-icon>mdi-plus</v-icon>
        <span>Add Image</span>
      </v-btn>
    </div>

    <v-btn
      class="mt-5"
      color="primary"
      :loading="sendInfo"
      prepend-icon="mdi-content-save"
      text="Save"
      width="100%"
      @click="updateWaifu"
    />
  </div>
  <div v-if="waifu.name == null && loading == false">
    <h2>Waifu not found</h2>
  </div>
  <div v-if="loading == true" class="center-element">
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import ImageRender from '@/components/ImageRender.vue'
  import { Waifu } from '@/interfaces/waifu'
  import { Franchise } from '@/interfaces/franchise'
  import { WaifuType } from '@/interfaces/waifu_type'
  import { ImageType } from '@/interfaces/image_type'
  import { WaifuRarity } from '@/interfaces/waifu_rarity'
  import { WaifuImage } from '@/interfaces/waifu_image'
  import { VFileInput } from 'vuetify/components'
  const loading = ref(false)
  const id = ref(0)
  const franchises = ref([] as Franchise[])
  const waifuTypes = ref([] as WaifuType[])
  const imageTypes = ref([] as ImageType[])
  const waifuRarities = ref([] as WaifuRarity[])
  const waifuOriginal = ref({} as Waifu)
  const waifu = ref({} as Waifu)
  const sendInfo = ref(false)
  const baseUrl = import.meta.env.VITE_BASE_URL_API
  const fileRules = ref([
        (value: File[]) => {
          return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
        },
      ])

  onMounted(() => {
    id.value = parseInt(router.currentRoute.value.params.id)
    window.scrollTo(0, 0)
    findFranchises()
    findWaifuTypes()
    findWaifuRarities()
    findImageTypes()
    findWaifu()
  })

  const findFranchises = async () => {
    const url = `${baseUrl}/franchises`
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.ok) {
      const values = await response.json()
      franchises.value = values.data as Franchise[]
    }
  }

  const findWaifuTypes = async () => {
    const url = `${baseUrl}/waifu_types`
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.ok) {
      const values = await response.json()
      waifuTypes.value = values.data as WaifuType[]
    }
  }

  const findWaifuRarities = async () => {
    const url = `${baseUrl}/waifu_rarities`
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.ok) {
      const values = await response.json()
      waifuRarities.value = values.data as WaifuRarity[]
    }
  }

  const findImageTypes = async () => {
    const url = `${baseUrl}/image_types?specials=false`
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.ok) {
      const values = await response.json()
      imageTypes.value = values.data as ImageType[]
    }
  }

  const findWaifu = async () => {
    loading.value = true
    const url = `${baseUrl}/waifus/${id.value}`
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      const values = await response.json()
      waifuOriginal.value = values.data as Waifu
      waifu.value = values.data as Waifu
    }
    loading.value = false
  }

  const addImage = () => {
    const newWaifuImage: WaifuImage = {
      id: 0,
      publicId: (0).toString(),
      publicUrl: '',
      waifuId: id.value,
      ImageTypeId: 1,
      rarityId: 1,
      points: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    waifu.value.waifuImages.push(newWaifuImage)
  }

  const deleteImage = (index: number) => {
    waifu.value.waifuImages.splice(index, 1)
  }

  const selectImage = async (index: number) => {
    const input = window.document.getElementById(`imageFileIndex${index}`) as VFileInput
    input.click()
  }

  const updateWaifu = async () => {
    sendInfo.value = true
    const url = `${baseUrl}/waifus/${id.value}`
    const response = await fetch(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(waifu.value),
      }
    )
    sendInfo.value = false
    if (response.ok) {
      console.log('updated')
      router.back()
    } else {
      console.error(response)
    }
  }
</script>
