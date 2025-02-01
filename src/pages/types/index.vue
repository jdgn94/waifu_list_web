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
    @click="createWaifuType"
  />

  <DialogWaifuType
    v-model="openDialog"
    :data="dataToEdit"
    :success="getWaifuTypes"
  />

  <GridBox :actions="actions" :body="types" :header="header" />
</template>

<script lang="ts" setup>
  import { GridBoxActions, GridBoxHeader } from '@/interfaces/grid_box'
  import { WaifuType } from '@/interfaces/waifu_type'
  import roleLevel from '@/plugins/role_level'
  import api from '@/utils/axios.utils'

  const openDialog = ref(false)
  const dataToEdit = ref(undefined) as Ref<WaifuType | undefined>
  const actions = ref([
    {
      icon: 'mdi-pencil',
      color: 'blue',
      title: 'Edit',
      onClick: (item: any) => editWaifuType(item),
    },
  ]) as Ref<GridBoxActions[]>
  const header: GridBoxHeader[] = [
    { id: 'name', title: 'Name' },
  ]
  const types = ref([]) as Ref<WaifuType[]>

  onMounted(() => {
    getWaifuTypes()
  })

  const getWaifuTypes = async () => {
    const { data } = await api.get('/waifu_types')
    types.value = data.map((type: any) => {
      return {
        id: type.id,
        name: type.name,
      }
    })

    console.log(data)
  }

  const editWaifuType = (waifuType: any) => {
    console.log(waifuType)
    dataToEdit.value = waifuType
    setTimeout(() => {
      openDialog.value = true
    }, 300)
  }

  const createWaifuType = () => {
    dataToEdit.value = undefined
    setTimeout(() => {
      openDialog.value = true
    }, 300)
  }
</script>
