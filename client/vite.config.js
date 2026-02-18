// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "EventBook",
        short_name: "EventBook",
        description: "Event Booking Application",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/"
      }
    })
  ]
});
