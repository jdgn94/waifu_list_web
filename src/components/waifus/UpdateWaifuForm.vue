<template>
  <v-text-field
    v-model="waifuLocal.name"
    label="Name"
    type="text"
  />
  <v-text-field
    v-model="waifuLocal.nickname"
    label="Nickname"
    type="text"
  />
  <v-text-field
    v-model="waifuLocal.age"
    label="Age"
    type="number"
  />
  <v-autocomplete
    v-model="waifuLocal.typeId"
    item-title="name"
    item-value="id"
    :items="waifuTypes"
    label="Type"
  />
  <FranchiseAutocomplete
    v-model="waifuLocal.franchiseId"
  />

  <!-- Images -->
  <div class="images-container">
    <v-card
      v-for="(waifuImage, index) in waifuLocal.waifuImages"
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
    text="Save"
    width="100%"
    @click="updateWaifu"
  />
</template>

<script setup lang="ts">
  import { ImageType } from '@/interfaces/image_type'
  import { Waifu } from '@/interfaces/waifu'
  import { WaifuImage } from '@/interfaces/waifu_image'
  import { WaifuRarity } from '@/interfaces/waifu_rarity'
  import { WaifuType } from '@/interfaces/waifu_type'
  import router from '@/router'
  import api from '@/utils/axios.utils'
  import { VFileInput } from 'vuetify/components'

  const waifuTypes = ref([] as WaifuType[])
  const imageTypes = ref([] as ImageType[])
  const waifuRarities = ref([] as WaifuRarity[])
  const waifuLocal = ref({} as Waifu)
  const sendInfo = ref(false)
  const fileRules = ref([
    (value: File[]) => {
      return !value || !value.length || value[0].size < 15000000 || 'Image size should be less than 15 MB!'
    },
  ])

  const p = defineProps({
    waifu: { type: Object as () => Waifu, required: true },
  })

  onMounted(() => {
    waifuLocal.value = p.waifu
    findWaifuTypes()
    findWaifuRarities()
    findImageTypes()
  })
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

  const addImage = () => {
    const newWaifuImage: WaifuImage = {
      id: 0,
      publicId: (0).toString(),
      publicUrl: '',
      waifuId: waifuLocal.value.id,
      imageTypeId: 1,
      rarityId: 1,
      points: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    waifuLocal.value.waifuImages.push(newWaifuImage)
  }

  const deleteImage = (index: number) => {
    waifuLocal.value.waifuImages.splice(index, 1)
  }

  const selectImage = async (index: number) => {
    const input = window.document.getElementById(`imageFileIndex${index}`) as VFileInput
    input.click()
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

  const updateWaifu = async () => {
    sendInfo.value = true
    const url = `/waifus/${waifuLocal.value.id}`
    const formData = new FormData()
    formData.append('name', waifuLocal.value.name)
    formData.append('nickname', waifuLocal.value.nickname ?? '')
    formData.append('age', waifuLocal.value.age?.toString() ?? '0')
    formData.append('franchise_id', waifuLocal.value.franchiseId!.toString())
    formData.append('type_id', waifuLocal.value.typeId!.toString())
    const images = waifuLocal.value.waifuImages.map(waifuImage => {
      formData.append(waifuImage.imageTypeId.toString(), waifuImage.imageFile!)
      return {
        id: waifuImage.id,
        image_type_id: waifuImage.imageTypeId,
        rarity_id: waifuImage.rarityId,
        points: waifuImage.points,
      }
    })
    formData.append('images', JSON.stringify(images))
    console.log(formData)
    const { status, data } = await api.put(url, formData)

    sendInfo.value = false
    if (status === 200) {
      console.log('updated')
      router.back()
    } else {
      console.error(data)
    }
  }
</script>
