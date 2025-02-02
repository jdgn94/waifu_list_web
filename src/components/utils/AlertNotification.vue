<template>
  <span class="notifications-container">
    <v-alert
      v-for="(notification, index) in notifications.notifications"
      :key="index"
      class="my-2"
      closable
      :color="notification.type"
      :icon="notification.icon"
      :text="notification.message"
      :title="getTitle(notification)"
      @click:close="notifications.remove(index)"
    />
  </span>
</template>

<script setup lang="ts">
  import { useNotificationStore, Notification } from '@/stores/notification'

  const notifications = useNotificationStore()

  watch(notifications, () => {
    const notificationIndex = notifications.notifications.length - 1
    setTimeout(() => {
      notifications.remove(notificationIndex)
    }, 5000)
  })

  const getTitle = (notification: Notification) => {
    switch (notification.type) {
      case 'success':
        return 'Success'
      case 'error':
        return 'Error'
      case 'info':
        return 'Info'
      case 'warning':
        return 'Warning'
      default:
        return 'Default'
    }
  }
</script>
