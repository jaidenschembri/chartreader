import App from './App.svelte';
import './style.css';

// Mount the app
import { mount } from 'https://cdn.jsdelivr.net/npm/svelte@5.0.0-next.1/+esm';

mount(App, {
  target: document.getElementById('app'),
});