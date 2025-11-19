<template>
  <header class="app-header">
    <div class="brand">
      <span class="brand-badge">LoanIt</span>
    </div>
    <nav class="app-nav">
      <RouterLink class="nav-link" to="/">Home</RouterLink>
      <RouterLink class="nav-link" to="/ausleihen">Ausleihen</RouterLink>
      <button
        v-if="!isLoggedIn"
        class="primary-btn"
        @click="$emit('open-login')"
      >
        Login / Registrieren
      </button>
      <button
        v-else
        class="logout-btn"
        @click="$emit('logout')"
      >
        Logout
      </button>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})
</script>