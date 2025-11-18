<script setup>

import { ref, onMounted } from 'vue'

const items = ref([])
const newItem = ref('')
const currentUserId = localStorage.getItem('currentUserId')
const isLoggedIn = !!currentUserId
const newDescription = ref('')

async function addItem() {
  if (!isLoggedIn) return

  const name = newItem.value.trim()
  const description = newDescription.value.trim()
  if (!name) return

  const res = await fetch('http://localhost:3000/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ownerId: currentUserId, name, description
    })
  })
  const data = await res.json()

  items.value.push(data.item)
  newItem.value = ''
  newDescription.value = ''
}

async function removeItem(id) {
  await fetch(`http://localhost:3000/items/${id}`, 
    { method: 'DELETE' }
  )
  items.value = items.value.filter(item => item.id !== id)
}

async function loadItems() {
  if (!isLoggedIn) return

  const res = await fetch('http://localhost:3000/items')
  const all = await res.json()

  items.value = all.filter(item => item.ownerId === currentUserId)
}

onMounted(loadItems)

function statusLabel(item) {
  if (item.status === 'borrowed') return 'Ausgeliehen'
  return 'Verfügbar'
}

</script>

<template>
  <section class="home">
    <header class="home-header">
      <h2>Meine Gegenstände</h2>
    </header>
      <p v-if="!isLoggedIn" class="info-text">Bitte melde dich an, um deine Gegenstände zu sehen.</p>
          <div v-else class="input-card">
              <label class="input-label"> Neuen Gegenstand eingeben</label>
              <div class="input">
                <input v-model="newItem" placeholder="Name des Gegenstands"></input>
              </div>
                <textarea v-model="newDescription" placeholder="Kurzbeschreibung (Zustand, Besonderheiten)"rows="2"></textarea>
          </div>
          <div class="input-add">
            <button @click="addItem">Hinzufügen</button>
          </div>
          

          <div v-if="items.length > 0" class="item-grid">
            <article v-for="item in items" :key="item.id" class="item-card">
              <div class="item-own">
                <h3 class="item-title">{{ item.name }}</h3>
                <p v-if="item.description" class="item-description">
                  {{ item.description }}
                </p>
                <p class="item-status">
                  Status: <span :class="['status-pill', item.status==='borrowed' ? 'status-borrowed' : 'status-available']">
                    {{ statusLabel(item) }}
                  </span>
                </p>
            </div>
            <button class="delete-btn" @click="removeItem(item.id)">Löschen</button>
          </article>
          </div>   
    <p v-else-if="isLoggedIn" class="info-text">Du hast noch keine Gegenstände hinzugefügt.</p>
  </section>
</template>

