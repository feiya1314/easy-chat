import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		uni(),
		// https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5
		// 手动导入 ElementPlus 
		// 如果使用 unplugin-element-plus 并且只使用组件 API，你需要手动导入样式 例如
		// import 'element-plus/es/components/message/style/css'
		// import { ElMessage } from 'element-plus'
		// ElementPlus(),
		// AutoImport({
		// 	resolvers: [ElementPlusResolver()],
		// }),
		// Components({
		// 	resolvers: [ElementPlusResolver()],
		// }),
	],
});