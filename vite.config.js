import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src/pages',  // HTML-страницы находятся здесь
  build: {
    outDir: '../../dist',  // Куда складывать собранный проект
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/pages/index.html'),
        catalog: resolve(__dirname, 'src/pages/catalog.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        product: resolve(__dirname, 'src/pages/product.html'),
        korzina: resolve(__dirname, 'src/pages/korzina.html'),
        favorites: resolve(__dirname, 'src/pages/favorites.html')
      }
    }
  },
  publicDir: resolve(__dirname, 'src') // чтобы Vite нашёл изображения, иконки и т.п.
})
