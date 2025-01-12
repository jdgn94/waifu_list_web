import { useSessionStore } from '@/stores/session'

const roleLevel = () => {
  const userStore = useSessionStore()
  if (userStore.role === 'admin') return 1
  if (userStore.role === 'moderator') return 2
  if (userStore.role === 'user') return 3
  return 4
}

export default roleLevel
