<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Beian from '../components/Beian/index.vue'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

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
</script>

<template>
  <div class="h-[calc(100vh-100px)] flex flex-col">
    <div class="h-[calc(100vh-100px)] dark:bg-[rgb(36,39,46)] transition-all flex flex-col" :class="[isMobile ? 'p-0' : 'p-4']">
      <div class="h-[calc(100vh-100px)] overflow-hidden" :class="getMobileClass">
        <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
          <Sider />
          <NLayoutContent class="h-[calc(100vh-140px)]">
            <RouterView v-slot="{ Component, route }">
              <component :is="Component" :key="route.fullPath" />
            </RouterView>
          </NLayoutContent>
        </NLayout>
      </div>
      <Permission :visible="needPermission" />
    </div>
  </div>
  <Beian v-if="!isMobile" class="h-[100px] max-h-[100px]" />
</template>
