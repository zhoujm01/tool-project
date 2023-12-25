import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import { createStyleImportPlugin, AndDesignVueResolve } from "vite-plugin-style-import"
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({

  //解决“vite use `--host` to expose”
  base: './',	//不加打包后白屏
  server: {
    host: '0.0.0.0',
    // port: 8080,      
    open: true
  },
  resolve: {
    //别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  build: {
    outDir: './dist/diagnostics'
    },
  plugins: [vue(),
  createStyleImportPlugin({
    resolves: [AndDesignVueResolve()],
    libs: [
      {
        libraryName: "ant-design-vue",
        esModule: true,
        resolveStyle: (name) => {
          return `ant-design-vue/es/${name}/style/index`
        }
      }
    ]
  }),
  Components({
    dirs: ['src/components'], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
    resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })]
  })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,

      }
    }
  },
})
