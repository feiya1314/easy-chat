import { defineStore } from 'pinia'
import type { ComponentState, SettingsState } from './helper'
import { defaultComponentSetting, defaultSetting, getLocalState, removeLocalState, setLocalState } from './helper'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),
  actions: {
    // Partial 把接口类型中定义的所有属性变成可选的
    updateSetting(settings: Partial<SettingsState>) {
      this.$state = { ...this.$state, ...settings }
      this.recordState()
    },

    resetSetting() {
      this.$state = defaultSetting()
      removeLocalState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})

export const useComponentSetting = defineStore('component-setting-store', {
  state: (): ComponentState => defaultComponentSetting(),

  getters: {
    getBeianShow: (state) => {
      return state.beianShow
    },
  },
  actions: {
    setBeianShow(show: boolean) {
      this.$state.beianShow = show
    },
  },
})
