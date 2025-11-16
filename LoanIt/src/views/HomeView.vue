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

<style scoped>
/* Page Container */
.home-section {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem 1.5rem;
}

/* Title */
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #222;
}

/* Neutral Hinweistext */
.info-text {
  color: #666;
  margin: 1rem 0;
}

/* Input + Add Button */
.input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

button {
  padding: 0.6rem 1rem;
  background: #4f75ff;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #3b5de0;
}

/* Itemliste */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Each item */
.item-card {
  background: #f8f8fb;
  border: 1px solid #ececf2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 1rem;
}

/* Delete button */
.delete-btn {
  background: #ff5c5c;
}

.delete-btn:hover {
  background: #e64848;
}
</style>