<script setup>

import { ref, onMounted } from 'vue'

const items = ref([])
const newItem = ref('')
const currentUserId = localStorage.getItem('currentUserId')
const isLoggedIn = !!currentUserId

async function addItem() {
  if (!isLoggedIn) return

  const name = newItem.value.trim()
  if (!name) return

  const res = await fetch('http://localhost:3000/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ownerId: currentUserId,
      name,
      description: ''
    })
  })
  const data = await res.json()

  items.value.push(data.item)
  newItem.value = ''
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

</script>

<template>
  <section>
    <h2>Meine Gegenstände</h2>
      <p v-if="!isLoggedIn">Bitte melde dich an, um deine Gegenstände zu sehen.</p>
          <div v-else>
              <input v-model="newItem" placeholder="Neuen Gegenstand eingeben" />
              <button @click="addItem">Hinzufügen</button>
          </div>
          <div v-if="items.length > 0">
              <ul>
                  <li v-for="item in items" :key="item.id">
                      {{ item.name }}
                      <button @click="removeItem(item.id)">Löschen</button>
                  </li>
              </ul>
          </div>
    <p v-else>Du hast noch keine Gegenstände hinzugefügt.</p>
  </section>
</template>

