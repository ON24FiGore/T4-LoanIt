<template>
  <div class="app-shell">
    <AppHeader />
    <HomeView />
  </div>
</template>
<script setup>
import AppHeader from './components/AppHeader.vue'
import HomeView from './views/HomeView.vue'
</script>

<style>
h1, h2, h3 { margin-bottom: 0.5rem; }
section { margin: 1rem; }
div { margin-bottom: 1rem; }
</style>
