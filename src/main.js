import { mount } from 'svelte'
import App from './App.svelte'
import './style.css'

// Mount the app
const app = mount(App, {
  target: document.getElementById('app'),
})

export default app