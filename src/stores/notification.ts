import { defineStore } from 'pinia'

export interface Notification {
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' | 'default',
  icon: string,
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
  }),

  getters: {
    get (state) {
      return state
    },
  },

  actions: {
    reset () {
      this.$reset()
    },

    add (notification: Notification) {
      this.notifications.push(notification)
    },

    remove (index: number) {
      this.notifications.splice(index, 1)
    },
  },
})
