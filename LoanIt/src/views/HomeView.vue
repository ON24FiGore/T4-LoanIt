<script setup>
import { ref } from 'vue'
const items = ref([])
const newItem = ref('')
const borrowedItems = ref([])

function addItem() {
  const name = newItem.value.trim()
  if (!name) return
  items.value.push({id: Date.now(),name})
  newItem.value = ''
}

function removeItem(id) {
  items.value = items.value.filter(item => item.id !== id)
}
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

  <section>
    <h2>Ausgeliehene Gegenstände</h2>

    <div v-if="borrowedItems.length > 0">
      <ul>
        <li v-for="item in borrowedItems" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <p v-else>Du hast aktuell keine Gegenstände ausgeliehen.</p>
  </section>
</template>

