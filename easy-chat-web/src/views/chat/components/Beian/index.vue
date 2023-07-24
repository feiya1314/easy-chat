<script lang="ts" setup>
import { ChevronDown20Regular as ArrowD } from '@vicons/fluent'
import { computed } from 'vue'
import { useComponentSetting } from '@/store'

const settingStore = useComponentSetting()

const getrotateClass = computed(() => {
  return settingStore.getBeianShow ? '' : 'rotate-180'
})

function adFooterHideOrShow() {
  if (settingStore.getBeianShow) {
    settingStore.setBeianShow(false)
    return
  }

  settingStore.setBeianShow(true)
}
</script>

<template>
  <footer class="transition-transform mt-0 dark:bg-[#101014] rounded-md shadow-sm dark:border-neutral-800 dark:text-gray-300 border flex flex-col relative ml-4 mr-4">
    <div class="z-10 w-[46px] h-[20px] rounded-t-lg bg-[#fcfcfc] border border-b-0 flex justify-center items-center dark:border-gray-700 dark:bg-[#48484E] absolute left-1/2 cursor-pointer -top-[19px]" @click="adFooterHideOrShow">
      <i class="relative w-6 h-6 inline-block text-center transition-transform" :class="getrotateClass">
        <ArrowD />
      </i>
    </div>
    <!-- <div class="relative h-2 bg-[#fcfcfc] shadow-sm border border-grey-50 border-opacity-25" /> -->
    <div class="relative h-20 overflow-hidden">
      <span>&nbsp;</span>
    </div>
    <div class="relative h-8 flex justify-center items-center text-xs overflow-hidden">
      <a href="https://beian.miit.gov.cn" target="_blank"> 豫ICP备2022010979号-1 &nbsp;&nbsp;</a>
      <img src="@/assets/beian.png" style="width:18px;height:18px;vertical-align: middle;">
      <a target="_blank" rel="nofollow noreferrer" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402005563">&nbsp;粤公网安备 44030402005563号</a> &nbsp;&nbsp;&nbsp;&nbsp;
      <span>2022 - 2023 EASYOCR.CN ALL RIGHT RESERVED</span>
      <!-- <a target="_blank" rel="nofollow noreferrer" href=" ">粤公网安备 44030402005563号 </a> 2022 - 2023 EASYOCR.CN ALL RIGHT  RESERVED -->
    </div>
  </footer>
</template>

<!-- <style scoped>
.ad-footer::after {
  content: '';
  clear: both;
  display: block;
}
</style> -->
