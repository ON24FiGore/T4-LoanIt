<script setup>
import { ref } from 'vue'
const items = ref([])

const newItem = ref('')

function addItem() {
  const name = newItem.value.trim()
  if (!name) return
  items.value.push({name})
  newItem.value = ''
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
                </li>
            </ul>
        </div>
    <p v-else>Du hast noch keine Gegenstände hinzugefügt.</p>
  </section>
</template>
