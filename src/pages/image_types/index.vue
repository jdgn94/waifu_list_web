<template>
  <v-fab
    v-if="roleLevel() <= 2"
    absolute
    class="floating-button"
    color="secondary"
    extended
    location="end"
    position="fixed"
    prepend-icon="mdi-plus"
    size="64"
    z-index="10"
    @click="newImageType"
  />

  <DialogImageTypes
    v-model="openDialog"
    :data="imageTypeSelected"
    :success="getImageTypes"
  />

  <GridBox :actions="actions" :body="imageTypes" :header="header" />
</template>

<script setup lang="ts">
  import { GridBoxActions, GridBoxHeader } from '@/interfaces/grid_box'
  import { ImageType } from '@/interfaces/image_type'
  import roleLevel from '@/plugins/role_level'
  import api from '@/utils/axios.utils'

  const openDialog = ref(false)
  const imageTypes = ref([]) as Ref<ImageType[]>
  const imageTypeSelected = ref(undefined) as Ref<ImageType | undefined>
  const actions = [
    {
      icon: 'mdi-pencil',
      color: 'blue',
      title: 'Create',
      onClick: (item: any) => editImageType(item),
      hide: (item: any) => /Special/.test(item.name) || item.name === 'Normal',
    }] as GridBoxActions[]
  const header = [
    { id: 'name', title: 'Name' },
    { id: 'icon', title: 'Icon' },
    { id: 'initialDate', title: 'Initial Date' },
    { id: 'finalDate', title: 'Final Date' },
  ] as GridBoxHeader[]

  onMounted(() => {
    getImageTypes()
  })

  const getImageTypes = async () => {
    const url = `/image_types`
    const { status, data } = await api.get(url)

    if (status === 200) {
      imageTypes.value = data as ImageType[]
    }
  }

  const editImageType = (imageType: ImageType) => {
    imageTypeSelected.value = imageType
    openDialog.value = true
  }

  const newImageType = () => {
    imageTypeSelected.value = undefined
    openDialog.value = true
  }
</script>
