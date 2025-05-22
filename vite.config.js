import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    allowedHosts: [
      '29da-2c0f-f698-c237-9b5e-bd97-b055-f3dc-4700.ngrok-free.app'
    ]
  }
 
})
