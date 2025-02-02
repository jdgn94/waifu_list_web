<template>
  <v-dialog v-model="openDialog" max-width="500">
    <v-card :title="(props.data ? 'Edit' : 'Create') + ' Waifu Rarity'">
      <v-card-text>
        <v-text-field
          v-model="name"
          autofocus
          color="primary"
          :error-messages="name.length < 4 ? 'Name must be at least 4 characters' : ''"
          label="Name"
        />
        <v-text-field
          v-model="icon"
          color="primary"
          :error-messages="!emojiRegex.test(icon) ? 'Icon is required' : ''"
          label="Icon"
        />
        <v-text-field
          v-model="cost"
          color="primary"
          :error-messages="!cost || cost < 0 ? 'Cost must be greater than 0' : ''"
          label="Cost"
          type="number"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          :disabled="name.length < 4 || !emojiRegex.test(icon) || !cost || cost < 0"
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
  import { WaifuRarity } from '@/interfaces/waifu_rarity'
  import { useNotificationStore } from '@/stores/notification'
  import api from '@/utils/axios.utils'

  const notifications = useNotificationStore()
  const openDialog = defineModel({ type: Boolean, default: false })
  const emojiRegex = /\p{Extended_Pictographic}/u
  const name = ref('')
  const icon = ref('')
  const cost = ref(null) as Ref<number | null>
  const props = defineProps({
    data: { type: Object as () => WaifuRarity | undefined, required: false, default: undefined },
    success: { type: Function, required: true },
  })

  watch(openDialog, (newValue: boolean) => {
    if (newValue === true) {
      name.value = props.data ? props.data.name : ''
      icon.value = props.data ? props.data.icon : ''
      cost.value = props.data ? props.data.cost : null
    }
  })

  const save = async () => {
    try {
      if (name.value.length < 4) {
        throw new Error('Name must be at least 4 characters')
      }
      if (!emojiRegex.test(icon.value)) throw new Error('Icon is required')
      if (props.data) {
        const { status } = await api.put(`/waifu_rarities/${props.data.id}`, {
          name: name.value,
          icon: icon.value,
          cost: cost.value,
        })

        if (status === 200) {
          openDialog.value = false
          props.success()
          notifications.add({
            icon: 'mdi-check',
            type: 'success',
            message: 'Waifu rarity updated successfully',
          })
          return
        }

        throw new Error('Error updating waifu rarity')
      }

      const { status } = await api.post('/waifu_rarities', {
        name: name.value,
        icon: icon.value,
        cost: cost.value,
      })

      if (status === 200) {
        openDialog.value = false
        props.success()
        notifications.add({
          icon: 'mdi-check',
          type: 'success',
          message: 'Waifu rarity created successfully',
        })
        return
      }

      throw new Error('Error creating waifu rarity')
    } catch (error) {
      notifications.add({
        icon: 'mdi-alert-circle-outline',
        type: 'error',
        message: (error as Error).message,
      })
      console.error(error)
    }
  }

  const close = () => {
    openDialog.value = false
  }
</script>
