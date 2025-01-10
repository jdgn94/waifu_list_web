import router from '@/router'
import axios, { AxiosError } from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL_API

axios.defaults.headers.common.Authorization = localStorage.getItem('token')
  ? `Bearer ${localStorage.getItem('token')}`
  : ''

async function setHeaderAuth (token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

async function removeHeaderAuth () {
  axios.defaults.headers.common.Authorization = ''
}

const errorResponse = (error: AxiosError) => {
  if (error.response?.status === 401) {
    removeHeaderAuth()
    router.replace('/')
  }
  return error.response!
}

const api = {
  get: async (url: string) => {
    const response = await axios({
      method: 'get',
      url,
    })
      .then(res => res)
      .catch(errorResponse)

    return response
  },

  post: async (url: string, data: any) => {
    const response = await axios({
      method: 'post',
      url,
      data,
    })
      .then(res => res)
      .catch(errorResponse)

    return response
  },

  put: async (url: string, data: any) => {
    const response = await axios({
      method: 'put',
      url,
      data,
    })
      .then(res => res)
      .catch(errorResponse)

    return response
  },
}

export { setHeaderAuth, removeHeaderAuth }
export default api
