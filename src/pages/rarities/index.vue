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
    @click="newWaifuRarity"
  />

  <DialogRarities
    v-model="openDialog"
    :data="rarityToEdit"
    :success="getRarities"
  />

  <GridBox :actions="actions" :body="rarities" :header="header" />
</template>

<script lang="ts" setup>
  import { GridBoxActions, GridBoxHeader } from '@/interfaces/grid_box'
  import { WaifuRarity } from '@/interfaces/waifu_rarity'
  import roleLevel from '@/plugins/role_level'
  import api from '@/utils/axios.utils'

  const rarities = ref([]) as Ref<WaifuRarity[]>
  const openDialog = ref(false)
  const rarityToEdit = ref(undefined) as Ref<WaifuRarity | undefined>
  const header = [
    { id: 'name', title: 'Name' },
    { id: 'icon', title: 'Icon' },
    { id: 'cost', title: 'Cost' },
  ] as GridBoxHeader[]
  const actions = [
    {
      icon: 'mdi-pencil',
      color: 'blue',
      title: 'Create',
      onClick: (item: any) => editWaifuRarity(item),
    },
  ] as GridBoxActions[]

  onMounted(() => {
    getRarities()
  })

  const getRarities = async () => {
    const url = `/waifu_rarities`
    const { status, data } = await api.get(url)
    if (status === 200) {
      console.log(data)
      rarities.value = data as WaifuRarity[]
    }
  }

  const editWaifuRarity = (waifuRarity: WaifuRarity) => {
    rarityToEdit.value = waifuRarity
    openDialog.value = true
  }

  const newWaifuRarity = () => {
    rarityToEdit.value = undefined
    openDialog.value = true
  }
</script>
