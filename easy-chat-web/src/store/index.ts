import type { App } from 'vue'
import { createPinia } from 'pinia'

export const store = createPinia()

export function setupStore(app: App) {
  app.use(store)
}

// Store 是用 defineStore() 定义的，可以定义多个store
// Store  是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定,承载着全局状态。
// 有点像一个永远存在的组件，每个组件都可以读取和写入它。
// 有三个概念，state、getter 和 action，可以假设这些概念相当于组件中的 data、 computed 和 methods
export * from './modules'
