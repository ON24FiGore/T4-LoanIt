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

function statusLabel(item) {
  if (item.status === 'borrowed') return 'Ausgeliehen'
  return 'Verfügbar'
}

</script>

<template>
  <section class="borrow">
    <header class="home-header">
      <h2>Ausgeliehene Gegenstände</h2>
    </header>
    <p v-if="!isLoggedIn" class="info-text">
      Bitte melde dich an, um deine Ausleihen zu sehen.
    </p>
    <div v-else>
      <div v-if="borrowedByMe.length > 0" class="item-grid">
        <article v-for="item in borrowedByMe" :key="item.id" class="item-card">
          <div class="item-own">
            <h3 class="item-title">{{ item.name }}</h3>
            <p v-if="item.description" class="item-description">
              {{ item.description }}
            </p>
            <p class="item-status">
              Status:
              <span
                :class="['status-pill', item.status==='borrowed' ? 'status-borrowed' : 'status-available']"
              >
                {{ statusLabel(item) }}
              </span>
            </p>
          </div>
          <button class="delete-btn" @click="returnItem(item.id)">Zurückgeben</button>
        </article>
      </div>
      <p v-else class="info-text">Du hast aktuell keine Gegenstände ausgeliehen.</p>
    </div>
  </section>

  <section>
    <h2>Verfügbare Gegenstände</h2>
    <p v-if="!isLoggedIn" class="info-text">
      Bitte melde dich an, um Gegenstände auszuleihen.
    </p>
    <div v-else>
      <div v-if="availableItems.length > 0" class="item-grid">
        <article v-for="item in availableItems" :key="item.id" class="item-card">
          <div class="item-own">
            <h3 class="item-title">{{ item.name }}</h3>
            <p v-if="item.description" class="item-description">
              {{ item.description }}
            </p>
            <p class="item-status">
              Status:
              <span
                :class="['status-pill', item.status==='borrowed' ? 'status-borrowed' : 'status-available']"
              >
                {{ statusLabel(item) }}
              </span>
            </p>
          </div>
          <button class="borrow-btn" @click="borrowItem(item.id)">Ausleihen</button>
        </article>
      </div>
      <p v-else class="info-text">Momentan sind keine Gegenstände verfügbar.</p>
    </div>
  </section>
</template>