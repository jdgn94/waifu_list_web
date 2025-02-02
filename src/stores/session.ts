// Utilities
import { defineStore } from 'pinia'

export interface UserInfo {
  level: number
  exp: number
  limitExp: number
  coins: number
  diamonds: number
  goldenTickets: number
  favoritePages: number
  favoritePagePurchases: number
  loginDaily: boolean
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    username: '',
    nickname: '',
    role: '',
    userInfo: {
      level: 0,
      exp: 0,
      limitExp: 0,
      coins: 0,
      diamonds: 0,
      goldenTickets: 0,
      favoritePages: 0,
      favoritePagePurchases: 0,
      loginDaily: false,
    },
    token: null as string | null,
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

    create (
      username: string,
      nickname: string,
      role: string,
      info: UserInfo,
      token: string
    ) {
      this.username = username
      this.nickname = nickname
      this.role = role
      this.userInfo = info
      this.token = token
    },
  },
})
