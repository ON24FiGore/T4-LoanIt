<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <section>
    <h2>Login</h2>
      <div>
        <label for="email">E-Mail</label>
        <div>
          <input id="email" type="email" v-model="email" placeholder="max@mustermann.de" required />
        </div>
      </div>

      <div>
        <label for="password">Passwort</label>
        <div>
          <input id="password" type="password" v-model="password" required />
        </div>
      </div>

      <div>
        <button>Anmelden</button>
      </div>
  </section>
</template>