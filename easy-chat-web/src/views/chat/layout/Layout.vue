<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Beian from '../components/Beian/index.vue'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore, useComponentSetting } from '@/store'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()
const settingStore = useComponentSetting()

// 路由跳转,不会在路由栈中添加记录,跳转到 Chat子路由,且参数是 uuid
// 最开始默认的 活跃的uuid 是用户id，后面新增时 uuid 是时间戳，一个聊天对应一个uuid
router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-sm', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})

const adHeight = computed(() => {
  return settingStore.getBeianShow ? 'h-[100px]' : 'h-0'
})

const contentHeight = computed(() => {
  return settingStore.getBeianShow ? 'h-[calc(100vh-100px)]' : 'h-[calc(100vh-5px)]'
})
</script>

<template>
  <div class="flex flex-col" :class="contentHeight">
    <div class="h-full dark:bg-[rgb(36,39,46)] transition-all flex flex-col" :class="[isMobile ? 'p-0' : 'p-4']">
      <div class="h-full overflow-hidden" :class="getMobileClass">
        <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
          <Sider />
          <NLayoutContent class="h-full">
            <RouterView v-slot="{ Component, route }">
              <component :is="Component" :key="route.fullPath" />
            </RouterView>
          </NLayoutContent>
        </NLayout>
      </div>
      <Permission :visible="needPermission" />
    </div>
  </div>
  <Beian v-if="!isMobile" :class="adHeight" />
</template>
