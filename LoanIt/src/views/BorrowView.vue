<script setup>
import { ref } from 'vue'

const availableItems = ref([])
const borrowedByYou = ref([])

</script>

<template>
  <section>
    <h2>Ausgeliehene Gegenstände</h2>
        <div v-if="borrowedByYou.length > 0">
          <ul>
            <li v-for="it in borrowedByYou" :key="it.id">
              {{ it.name }} — geliehen von {{ it.owner }}
            </li>
          </ul>
        </div>
      <p v-else>Du hast aktuell keine Gegenstände ausgeliehen.</p>
  </section>

  <section>
    <h2>Verfügbare Gegenstände</h2>
      <div v-if="availableItems.length > 0">
        <ul>
          <li v-for="it in availableItems" :key="it.id">
            {{ it.name }} — von {{ it.owner }}
          </li>
        </ul>
      </div>
    <p v-else>Momentan sind keine Gegenstände verfügbar.</p>
  </section>
</template>