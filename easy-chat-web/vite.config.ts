import path from 'path'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: 'chatGPT',
        short_name: 'chatGPT',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ]
}

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      // 反向代理配置，只在开发模式有效(pnpm dev)，请求会对 /api开头的请求路径进行代理，转发到 target 地址,解决跨域请求的问题
      // build后，部署到生产模式下,Vite 不会提供开发服务器，而是将应用程序打包成静态文件，并由生产服务器（如 Nginx）
      // 提供和服务这些静态文件。在生产模式下，Vite 的代理配置不会生效，因为代理是开发服务器的功能。
      // 开发模式下，浏览器请求，首先到达 Vue CLI 的开发服务器，然后由开发服务器代理转发请求
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          // rewrite: path => path.replace('/api/', '/'),
          rewrite: path => path.replace('/api/', '/api/'),
        },
      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
