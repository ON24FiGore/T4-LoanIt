<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { VueFinalModal, ModalsContainer } from 'vue-final-modal'
import AppHeader from './components/AppHeader.vue'

const showModal = ref(false)
const isRegister = ref(false)
const isLoggedIn = ref(!!localStorage.getItem('currentUserId'))

const id = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

function openLogin() {
  showModal.value = true
  isRegister.value = false
  message.value = ''
}

async function login() {
  message.value = ''
  const res = await fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id.value, password: password.value })
  })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    message.value = data?.error || 'Login fehlgeschlagen'
    return
  }

  localStorage.setItem('currentUserId', data.user.id)
  showModal.value = false
  isLoggedIn.value = true
  window.location.reload()

}

async function registerUser() {
  message.value = ''
  const res = await fetch('http://localhost:3000/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: id.value,
      email: email.value,
      password: password.value
    })
  })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    message.value = data?.error || 'Registrierung fehlgeschlagen'
    return
  }

  localStorage.setItem('currentUserId', data.user.id)
  showModal.value = false
  isLoggedIn.value = true
  window.location.reload()

}

function logout() {
  localStorage.removeItem('currentUserId')
  isLoggedIn.value = false
  showModal.value = true
  window.location.reload()
}

onMounted(() => {
  if (!isLoggedIn.value) {
    openLogin()
  }
})
</script>

<template>
  <div class="app-shell">
    <AppHeader :is-logged-in="isLoggedIn" @open-login="openLogin" @logout="logout" />
    <RouterView />
    <VueFinalModal v-model="showModal" content-class="auth-modal">
      <h3 v-if="!isRegister">Login</h3>
      <h3 v-else>Registrierung</h3>

      <input v-model="id" placeholder="Benutzername" />
      <input v-if="isRegister" v-model="email" placeholder="E-Mail (optional)" />
      <input v-model="password" type="password" placeholder="Passwort" />

      <p>{{ message }}</p>

      <button v-if="!isRegister" class="primary-btn" @click="login">Login</button>
      <button v-else class="primary-btn" @click="registerUser">Registrieren</button>

      <p>
        <a href="#" @click.prevent="isRegister = !isRegister">
          {{ isRegister ? 'Zum Login wechseln' : 'Neu hier? Jetzt registrieren' }}
        </a>
      </p>
    </VueFinalModal>
    <ModalsContainer />
  </div>
</template>

<style>
:root {
  --vue-green: #42b883;
  --vue-deep-green: #35495e;
  --vue-light: #e9f6f1;
  --vue-lightest: #f6fbf9;
  --vue-dark: #1f2d3d;
  --border-color: #e1e8f0;
  --shadow-color: rgba(31, 45, 61, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(180deg, var(--vue-lightest), #ffffff);
  color: var(--vue-dark);
}

.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(66, 184, 131, 0.08), transparent 60%);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(53, 73, 94, 0.06);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.brand-badge {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--vue-deep-green);
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: var(--vue-deep-green);
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link.router-link-exact-active {
  background: var(--vue-light);
  color: var(--vue-green);
}

button {
  border: none;
  cursor: pointer;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.55rem 1.1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

button:active {
  transform: scale(0.98);
}

.primary-btn {
  background: var(--vue-green);
  color: #fff;
  box-shadow: 0 8px 16px rgba(66, 184, 131, 0.25);
}

.primary-btn:hover {
  background: #37a972;
}

.delete-btn {
  background: rgba(53, 73, 94, 0.12);
  color: var(--vue-deep-green);
}

.delete-btn:hover {
  background: rgba(53, 73, 94, 0.18);
}

.borrow-btn {
  background: rgba(66, 184, 131, 0.15);
  color: var(--vue-green);
}

.borrow-btn:hover {
  background: rgba(66, 184, 131, 0.25);
}

.logout-btn {
  background: rgba(216, 76, 56, 0.12);
  color: #d84c38;
  border: 1px solid rgba(216, 76, 56, 0.15);
}

.logout-btn:hover {
  background: rgba(216, 76, 56, 0.18);
}

.home,
.borrow {
  max-width: 1040px;
  margin: 2rem auto;
  padding: 0 1.5rem 4rem;
}

.home-header h2,
.borrow h2 {
  color: var(--vue-deep-green);
  margin-bottom: 0.75rem;
}

.info-text {
  background: var(--vue-lightest);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  color: var(--vue-deep-green);
  box-shadow: inset 0 1px 3px rgba(31, 45, 61, 0.05);
}

.input-card {
  background: #fff;
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 16px 32px var(--shadow-color);
  border: 1px solid rgba(225, 232, 240, 0.8);
  margin-bottom: 0.75rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: var(--vue-deep-green);
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--vue-green);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-top: 1.25rem;
}

@media (max-width: 768px) {
  .item-grid {
    grid-template-columns: 1fr;
  }
}

.item-card {
  background: #fff;
  border-radius: 24px;
  padding: 1.25rem;
  border: 1px solid rgba(225, 232, 240, 0.9);
  box-shadow: 0 18px 30px var(--shadow-color);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.item-own {
  flex: 1;
}

.item-title {
  margin: 0 0 0.4rem;
  color: var(--vue-deep-green);
}

.item-description {
  margin: 0 0 0.75rem;
  color: rgba(31, 45, 61, 0.8);
  font-size: 0.95rem;
}

.item-status {
  margin: 0;
  font-weight: 600;
  color: var(--vue-deep-green);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.status-borrowed {
  background: rgba(255, 99, 71, 0.15);
  color: #d84c38;
}

.status-available {
  background: rgba(66, 184, 131, 0.15);
  color: var(--vue-green);
}

.auth-modal {
  background: #fff;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(53, 73, 94, 0.25);
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-modal h3 {
  margin: 0;
  color: var(--vue-deep-green);
}

.auth-modal p {
  margin: 0;
}
</style>
