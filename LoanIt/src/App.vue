<template>
  <div class="app-shell">
    <AppHeader />
    <RouterView />
  </div>
</template>
<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<style>
h1, h2, h3 { margin-bottom: 0.5rem; }
section { margin: 1rem; }
div { margin-bottom: 1rem; }
</style>
