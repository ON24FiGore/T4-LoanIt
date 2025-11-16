<script setup>

import { ref, onMounted } from 'vue'

const items = ref([])
const newItem = ref('')
const currentUserId = 'Finn-1'

async function addItem() {
  const name = newItem.value.trim()
  if (!name) return

  try {
    const res = await fetch('http://localhost:3000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: currentUserId,
        name,
        description: '',
      }),
    })

    const data = await res.json()
    items.value.push(data.item)
    newItem.value = ''
  } catch (err) {
    console.error('Fehler beim Anlegen des Items', err)
  }
}

async function removeItem(id) {
  try {
    await fetch(`http://localhost:3000/items/${id}`, {
      method: 'DELETE',
    })
    items.value = items.value.filter(item => item.id !== id)
  } catch (err) {
    console.error('Fehler beim Löschen des Items', err)
  }
}
async function loadItems() {
  try {
    const res = await fetch('http://localhost:3000/items')
    const allItems = await res.json()
    items.value = allItems.filter(item => item.ownerId === currentUserId)
  } catch (err) {
    console.error('Fehler beim Laden der Items', err)
  }
}

onMounted(() => {
  loadItems()
})

</script>

<template>
  <section>
    <h2>Meine Gegenstände</h2>
        <div>
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