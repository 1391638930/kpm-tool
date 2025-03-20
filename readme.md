部署线上环境打包，需要修改多个文件的配置
1. config/vite.config.base.ts
  base: '/kpm/'
2. .env.production
  使用devlop prod配置
3. App.vue
  envUrl = 'online'
4. interceptors.ts
  envUrl = 'online'
