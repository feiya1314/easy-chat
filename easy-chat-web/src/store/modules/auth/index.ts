import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'
import { fetchSession } from '@/api'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

function getDefaultSession(): SessionResponse {
  return {
    auth: true,
    model: 'ChatGPTAPI',
  }
}

export interface AuthState {
  token: string | undefined
  expire: number | null
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    // token: getToken(),
    // 这里默认通过，给个默认值
    token: getToken(),
    expire: 60 * 60 * 24 * 1,
    // 这里先使用默认session，默认通过，不校验session
    session: getDefaultSession(),
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      // state.session 后面一层读不到的话就会返回一个 undefined，然后隐式转换为 false ，而不是报错。双问号表达式 ??" 左边的表达式为 null 或者 undefined 的时候，返回表达式右边的值
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string, expire: number) {
      this.token = token
      this.expire = expire
      setToken(token, expire)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
