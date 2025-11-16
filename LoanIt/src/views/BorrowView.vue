<script setup>
import { ref, onMounted } from 'vue'

const availableItems = ref([])
const borrowedByMe = ref([])
const currentUserId = localStorage.getItem('currentUserId')
const isLoggedIn = !!currentUserId

async function loadItems() {
  if (!isLoggedIn) return

    const res = await fetch('http://localhost:3000/items')
    const allItems = await res.json()

    availableItems.value = allItems.filter(
      item =>
        item.ownerId !== currentUserId &&
        item.status === 'available'
    )

    borrowedByMe.value = allItems.filter(
      item =>
        item.borrowerId === currentUserId &&
        item.status === 'borrowed'
    )
  } 

async function borrowItem(id) {
  try {
    await fetch(`http://localhost:3000/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'borrowed',
        borrowerId: currentUserId,
      }),
    })
    await loadItems()
  } catch (err) {
    console.error('Fehler beim Ausleihen', err)
  }
}

async function returnItem(id) {

    await fetch(`http://localhost:3000/items/${id}`, 
    {method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      status: 'available',
      borrowerId: null,
      })
    })
    await loadItems()
  } 

onMounted(loadItems)


</script>

<template>
  <section>
    <h2>Ausgeliehene Gegenstände</h2>
      <div v-if="isLoggedIn">
        <ul v-if="borrowedByMe.length > 0">
            <li v-for="item in borrowedByMe" :key="item.id">
              {{ item.name }}
              <button @click="returnItem(item.id)">Zurückgeben</button>
            </li>
          </ul>
      <p v-else>Du hast aktuell keine Gegenstände ausgeliehen.</p>
    </div>
  </section>

  <section>
    <h2>Verfügbare Gegenstände</h2>
      <p v-if="!isLoggedIn">Bitte melde dich an, um Gegenstände auszuleihen.</p>
        <div v-else>
          <ul v-if="availableItems.length > 0">
            <li v-for="item in availableItems" :key="item.id">
              {{ item.name }}
              <button @click="borrowItem(item.id)">Ausleihen</button>
            </li>
          </ul>
      <p v-else>Momentan sind keine Gegenstände verfügbar.</p>
    </div>
  </section>
</template>