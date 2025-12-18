import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  // server: {
  //   "origin": "http://localhost:5173",
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       secure: false
  //     }
  //   }
  // },

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
