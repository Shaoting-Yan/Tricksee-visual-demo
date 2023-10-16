import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    https:{
      key:'./public/private.key',
      cert:'./public/certificate.crt',
    }
  },
  plugins: [react()],
  base:"/Tricksee-overlay/",
})
