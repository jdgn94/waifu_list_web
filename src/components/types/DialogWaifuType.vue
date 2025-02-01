<template>
  <v-dialog v-model="openDialog" max-width="500">
    <v-card :title="props.data ? 'Edit Waifu Type' : 'Create Waifu Type'">
      <v-card-text>
        <v-text-field v-model="name" label="Name" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          variant="elevated"
          @click="save"
        >
          <v-icon class="mr-1">mdi-check</v-icon>
          Save
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          @click="close"
        >
          <v-icon class="mr-1">mdi-close</v-icon>
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { WaifuType } from '@/interfaces/waifu_type'
  import api from '@/utils/axios.utils'

  const openDialog = defineModel({ type: Boolean, default: false })
  const name = ref('')
  const props = defineProps({
    /* openDialog: { type: Boolean, default: false } */
    data: { type: Object as () => WaifuType || undefined, required: false, default: undefined },
    success: { type: Function, required: true },
  })

  watch(openDialog, (newValue: boolean) => {
    if (newValue === true) {
      name.value = props.data ? props.data.name : ''
    }
  })

  const save = async () => {
    try {
      if (props.data) {
        const { status } = await api.put(`/waifu_types/${props.data.id}`, {
          name: name.value,
        })

        if (status === 200) {
          openDialog.value = false
          props.success()
          return
        }

        throw new Error('Error updating waifu type')
      }

      const { status } = await api.post('/waifu_types', {
        name: name.value,
      })

      if (status === 200) {
        openDialog.value = false
        props.success()
        return
      }

      throw new Error('Error creating waifu type')
    } catch (error) {
      console.error(error)
    }
  }

  const close = () => {
    openDialog.value = false
  }
</script>
