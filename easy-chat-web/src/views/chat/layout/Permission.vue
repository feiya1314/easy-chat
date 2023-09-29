<script setup lang='ts'>
import type { AxiosProgressEvent } from 'axios'
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
import Icon403 from '@/icons/403.vue'
import { getWxLoginStatus, getWxQr, fetchVerify } from '@/api'
import { useAuthStore, useChatStore, useUserStore } from '@/store'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()
const userStore = useUserStore()
const chatStore = useChatStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')
const scanned = ref(false)
const loginStatus = ref('已扫码,请确认登录')
const tempKey = ref('')

// const disabled = computed(() => !token.value.trim() || loading.value)
const disabled = ref(false)
const base64ImgPrefix = 'data:image/jpeg;base64,'
const base64Qr = ref('')

async function handleWxLogin() {
  try {
    loading.value = true
    await getWxQr({
      onDownloadProgress: ({ event }) => {
        const xhr = event.target
        if (xhr.status !== 200) {
          console.error('get qr error ,status : {}', xhr.status)
          console.error('get qr error ,response text : {}', xhr.responseText)
          throw new Error('error get qr')
        }

        const { responseText } = xhr
        const data = JSON.parse(responseText)
        scanned.value = true
        tempKey.value = data.tempKey
        base64Qr.value = base64ImgPrefix + data.base64Qr
        wxLoginStatus()
      },
    })
    ms.success('success')
    loginStatus.value = '请扫码并确认登录'
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
    token.value = ''
  }
  finally {
    loading.value = false
  }
}

async function wxLoginStatus() {
  // 每隔2秒钟查询一次状态，30s后停止
  const intervalId = setInterval(() => {
    try {
      getWxLoginStatus({
        tempKey: tempKey.value,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          if (xhr.status !== 200) {
            console.error('get qr error ,status : {}', xhr.status)
            console.error('get qr error ,response text : {}', xhr.responseText)
            return
          }

          const { responseText } = xhr
          const data = JSON.parse(responseText)
          if (data.errorCode) {
            console.error('error getWxLoginStatus : %i', data.errorCode)
            return
          }
          if (data.status === 'SCAN_QR') {
            loginStatus.value = '已扫码,请确认登录'
            return
          }
          if (data.status === 'LOGINING') {
            loginStatus.value = '正在登录中'
            return
          }
          if (data.status === 'REFUSE') {
            loginStatus.value = '拒绝登录'
            clearInterval(intervalId)
            throw new Error('已拒绝登录，登录失败')
          }
          if (data.status === 'EXCEPTION') {
            loginStatus.value = '登录异常'
            clearInterval(intervalId)
            throw new Error('拒绝异常，登录失败')
          }
          if (data.status === 'LOGIN') {
            loginStatus.value = '登录成功'
            token.value = data.token
            base64Qr.value = ''
            authStore.setToken(data.token, data.tokenExpiredTime)
            userStore.updateUserInfo({ userId: data.userId, name: data.username })

            processChats(data.userId)
            // userStore.userInfo.avatar = data.avatarUrl
            ms.success('登录成功')
            clearInterval(intervalId)
            window.location.reload()
          }
        },
      })
    }
    catch (error: any) {
      ms.error(error.message ?? 'error')
      authStore.removeToken()
      token.value = ''
    }
  }, 2000)

  // 60 秒钟后停止定时器
  setTimeout(() => {
    if (token.value === '')
      ms.error('登录失败')

    clearInterval(intervalId)
  }, 60000)
}

// 登录成功，1、当前的localstorage中历史chat 没有userid，则把当前的userId写入当前的历史
// 2、如果有历史userId，且不一样，则清空localstorage，重新初始化chat
// 3、如果有历史userId，且一样，则使用该历史chat
function processChats(userId: number) {
  if ((!chatStore.userId) || chatStore.userId === -1) {
    chatStore.setUserId(userId)
    chatStore.setActive(chatStore.active == null ? -1 : chatStore.active)
    return
  }

  if (chatStore.userId !== userId)
    chatStore.reInit(userId)

  // chatStore.setActive(dd)
}
// async function handleGptLogin() {
//   const secretKey = token.value.trim()

//   if (!secretKey)
//     return

//   try {
//     loading.value = true
//     await fetchVerify(secretKey)
//     authStore.setToken(secretKey)
//     ms.success('success')
//     window.location.reload()
//   }
//   catch (error: any) {
//     ms.error(error.message ?? 'error')
//     authStore.removeToken()
//     token.value = ''
//   }
//   finally {
//     loading.value = false
//   }
// }

// function handlePress(event: KeyboardEvent) {
//   if (event.key === 'Enter' && !event.shiftKey) {
//     event.preventDefault()
//     handleVerify()
//   }
// }
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 480px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            {{ $t('common.unauthorizedTips') }}
          </h2>
          <!-- <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p> -->
          <Icon403 v-if="!scanned" class="w-[260px] m-auto" />
          <div v-if="scanned">
            <img class="h-[260px] w-[260px] m-auto" :src="base64Qr">
            <p class="text-sm text-center">
              {{ loginStatus }}
            </p>
          </div>
        </header>
        <!-- <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" /> -->
        <NButton block type="primary" :disabled="disabled" :loading="loading" @click="handleWxLogin">
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
