import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useBasicLayout() {
  // 使用vueuse工具，获取当前设备的响应式断点，用于在不同的屏幕尺寸上定义不同的布局，判断当前设备是否是移动设备
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')

  return { isMobile }
}
