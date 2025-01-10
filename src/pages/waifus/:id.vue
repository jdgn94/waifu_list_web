<template>
  <div v-if="waifu.name != null || loading == true">
    <v-text-field
      v-model="waifu.name"
      label="Name"
      :readonly="sessionStore.token == null"
      type="text"
    />
    <v-text-field
      v-model="waifu.nickname"
      label="Nickname"
      :readonly="sessionStore.token == null"
      type="text"
    />
    <v-text-field
      v-model="waifu.age"
      label="Age"
      :readonly="sessionStore.token == null"
      type="number"
    />
    <v-autocomplete
      v-model="waifu.franchiseId"
      item-title="name"
      item-value="id"
      :items="franchises"
      label="Franchise"
      :readonly="sessionStore.token == null"
    />
    <v-autocomplete
      v-model="waifu.typeId"
      item-title="name"
      item-value="id"
      :items="waifuTypes"
      label="Type"
      :readonly="sessionStore.token == null"
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
          <v-icon v-if="sessionStore.token !== null" class="image-icon" icon="mdi-image" />
          <div
            v-if="sessionStore.token !== null"
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
          :readonly="sessionStore.token == null"
          :rules="fileRules"
          show-size
        />
        <v-autocomplete
          v-model="waifuImage.imageTypeId"
          item-title="name"
          item-value="id"
          :items="imageTypes"
          label="Type"
          :readonly="sessionStore.token == null"
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
          :readonly="sessionStore.token == null"
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
          :readonly="sessionStore.token == null"
          type="number"
        />
      </v-card>
      <v-btn
        v-if="sessionStore.token !== null"
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
      v-if="sessionStore.token !== null"
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
  import { useSessionStore } from '@/stores/session'
  import api from '@/utils/axios.utils'

  const loading = ref(false)
  const id = ref(0)
  const franchises = ref([] as Franchise[])
  const waifuTypes = ref([] as WaifuType[])
  const imageTypes = ref([] as ImageType[])
  const waifuRarities = ref([] as WaifuRarity[])
  const waifuOriginal = ref({} as Waifu)
  const waifu = ref({} as Waifu)
  const sendInfo = ref(false)
  const sessionStore = useSessionStore()
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

  const findWaifu = async () => {
    loading.value = true
    const url = `/waifus/${id.value}`
    const { status, data } = await api.get(url)

    if (status === 200) {
      waifuOriginal.value = data as Waifu
      waifu.value = data as Waifu
    }
    loading.value = false
  }

  const addImage = () => {
    const newWaifuImage: WaifuImage = {
      id: 0,
      publicId: (0).toString(),
      publicUrl: '',
      waifuId: id.value,
      imageTypeId: 1,
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
    const url = `/waifus/${id.value}`
    const formData = new FormData()
    formData.append('name', waifu.value.name)
    formData.append('nickname', waifu.value.nickname ?? '')
    formData.append('age', waifu.value.age?.toString() ?? '0')
    formData.append('franchise_id', waifu.value.franchiseId!.toString())
    formData.append('type_id', waifu.value.typeId!.toString())
    const images = waifu.value.waifuImages.map(waifuImage => {
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
