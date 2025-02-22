<template>
  <v-dialog v-model="openDialog" max-width="500" :persistent="loading">
    <v-card :title="(props.data ? 'Edit' : 'Create') + ' Image Type'">
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
          :error-messages="icon && !emojiRegex.test(icon) ? 'Icon is not valid' : ''"
          label="Icon"
        />
        <div class="d-flex justify-space-between">
          <DatePicker
            :date="initialDate"
            :default-value="initialDate"
            label="Initial Date"
            :max-date="finalDate"
            max-width="calc(50% - 5px)"
            :set-date="setInitialDate"
          />
          <DatePicker
            :date="finalDate"
            :default-value="finalDate"
            :error-messages="(finalDate && !initialDate) || (finalDate && initialDate && finalDate <= initialDate) ? 'Final date must be greater than initial date' : ''"
            label="Final Date"
            max-width="calc(50% - 5px)"
            :min-date="initialDate"
            :set-date="setFinalDate"
          />
        </div>
        <p>Note: On create or edit new image type the server automatically create the special type</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          :loading="loading"
          variant="elevated"
          @click="save"
        >
          <v-icon class="mr-1">mdi-check</v-icon>
          Save
        </v-btn>
        <v-btn
          color="error"
          :loading="loading"
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

<script lang="ts" setup>
  import { ImageType } from '@/interfaces/image_type'
  import { useNotificationStore } from '@/stores/notification'
  import api from '@/utils/axios.utils'

  const notifications = useNotificationStore()
  const openDialog = defineModel({ type: Boolean, default: false })
  const emojiRegex = /\p{Extended_Pictographic}/u
  const loading = ref(false)
  const name = ref('')
  const icon = ref('') as Ref<string | null>
  const initialDate = ref(undefined) as Ref<Date | undefined>
  const finalDate = ref(undefined) as Ref<Date | undefined>

  const props = defineProps({
    data: { type: Object as () => ImageType | undefined, required: false, default: undefined },
    success: { type: Function, required: true },
  })

  watch(openDialog, (newValue: boolean) => {
    if (newValue === true) {
      console.log(props.data)
      name.value = props.data ? props.data.name : ''
      icon.value = props.data ? props.data.icon : ''
      initialDate.value = props.data ? (props.data?.initialDate ? new Date(props.data.initialDate) : undefined) : undefined
      finalDate.value = props.data ? (props.data?.finalDate ? new Date(props.data.finalDate) : undefined) : undefined
    }
  })

  const setInitialDate = (date: Date) => {
    initialDate.value = date
  }

  const setFinalDate = (date: Date) => {
    finalDate.value = date
  }

  const save = async () => {
    try {
      if (name.value.length < 4) {
        throw new Error('Name must be at least 4 characters')
      }
      if (initialDate.value && finalDate.value && finalDate.value <= initialDate.value) {
        throw new Error('Final date must be greater than initial date')
      }
      loading.value = true
      if (props.data) {
        const { status } = await api.put(`/image_types/${props.data.id}`, {
          name: name.value,
          icon: icon.value,
          initialDate: initialDate.value,
          finalDate: finalDate.value,
        })
        if (status === 200) {
          notifications.add({
            type: 'success',
            icon: 'mdi-check',
            message: 'Image Type updated successfully',
          })
          props.success()
          openDialog.value = false
          return
        }

        throw new Error('Error updating image type')
      }

      const { status } = await api.post('/image_types', {
        name: name.value,
        icon: icon.value,
        initialDate: initialDate.value,
        finalDate: finalDate.value,
      })

      if (status === 200) {
        notifications.add({
          type: 'success',
          icon: 'mdi-check',
          message: 'Image Type created successfully',
        })
        props.success()
        openDialog.value = false
        return
      }

      throw new Error('Error creating image type')
    } catch (error) {
      notifications.add({
        type: 'error',
        icon: 'mdi-close',
        message: (error as Error).message,
      })
    } finally {
      loading.value = false
    }
  }

  const close = () => {
    openDialog.value = false
  }
</script>
