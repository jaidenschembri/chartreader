import App from './App.svelte';
import './style.css';

// Mount the app
import { mount } from 'svelte';

mount(App, {
  target: document.getElementById('app'),
});