import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/v1/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function getWxLoginStatus<T = any>(
  params: {
    tempKey: string
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const reqUrl = `/auth/v1/wx/loginStatus?tempKey=${params.tempKey}`
  return get<T>({
    url: reqUrl,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function getWxQr<T = any>(
  params: { onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return get<T>({
    url: '/auth/v1/wx/getQr',
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
