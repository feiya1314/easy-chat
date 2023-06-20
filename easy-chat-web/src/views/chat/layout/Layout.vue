<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
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
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-80 overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <div class="footer-b-copy">
      <a href="https://beian.miit.gov.cn" target="_blank"> 豫ICP备2022010979号-1 </a>
      <img src="@/assets/beian.png" style="width:18px;height:18px;vertical-align: middle;">
      <a target="_blank" rel="nofollow noreferrer" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402005563">粤公网安备 44030402005563号</a> 2022 - 2023 EASYOCR.CN ALL RIGHT  RESERVED
      <!-- <a target="_blank" rel="nofollow noreferrer" href=" ">粤公网安备 44030402005563号 </a> 2022 - 2023 EASYOCR.CN ALL RIGHT  RESERVED -->
    </div>
    <Permission :visible="needPermission" />
  </div>
</template>
