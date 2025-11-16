<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { VueFinalModal, ModalsContainer } from 'vue-final-modal'
import AppHeader from './components/AppHeader.vue'

const showModal = ref(false)
const isRegister = ref(false)

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
  window.location.reload()

}
</script>

<template>
  <div class="app-shell">
    <AppHeader @open-login="openLogin" />
    <RouterView />
    <VueFinalModal v-model="showModal">
      <h3 v-if="!isRegister">Login</h3>
      <h3 v-else>Registrierung</h3>

      <input v-model="id" placeholder="Benutzername" />
      <input v-if="isRegister" v-model="email" placeholder="E-Mail (optional)" />
      <input v-model="password" type="password" placeholder="Passwort" />

      <p>{{ message }}</p>

      <button v-if="!isRegister" @click="login">Login</button>
      <button v-else @click="registerUser">Registrieren</button>

      <p>
        <a href="#" @click.prevent="isRegister = !isRegister">
          {{ isRegister ? 'Zum Login wechseln' : 'Neu hier? Jetzt registrieren' }}
        </a>
      </p>
    </VueFinalModal>
    <ModalsContainer />
  </div>
</template>
