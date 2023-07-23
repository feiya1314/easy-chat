<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
// n-config-provider 的国际化配置 locale 设为从 naive-ui 导入的 zhCN 来设定全局中文。
// n-config-provider 的 date-locale 设为从 naive-ui 导入的 dateZhCN 来设定全局日期中文
const { language } = useLanguage()
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
