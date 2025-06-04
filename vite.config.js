import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  root: '.', // ensures Vite uses project-root as root
  base: '/chartreader/', // GitHub Pages base path
})
