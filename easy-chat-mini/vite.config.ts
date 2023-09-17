import path from "path";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import vwt from "weapp-tailwindcss-webpack-plugin/vite";
import postcssWeappTailwindcssRename from "weapp-tailwindcss-webpack-plugin/postcss";
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import ElementPlus from 'unplugin-element-plus/vite'

const isH5 = process.env.UNI_PLATFORM === "h5";

// vite 插件配置，注意一定要把 uni 注册在 vwt 前
const vitePlugins = [uni()];

const resolve = (p) => {
    return path.resolve(__dirname, p);
};

const postcssPlugins = [
    require("autoprefixer")(),
    require("tailwindcss")({
        config: resolve("./tailwind.config.js"),
    }),
];

if (!isH5) {
    vitePlugins.push(vwt());
    postcssPlugins.push(postcssWeappTailwindcssRename({}));
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: vitePlugins,
    // [
    // uni(),
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
    // ],
    css: {
        postcss: {
            // 内联写法
            plugins: postcssPlugins,
        },
    },
});