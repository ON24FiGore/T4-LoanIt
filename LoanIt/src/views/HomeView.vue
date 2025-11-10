<script setup>

</script>

<template>
  <section>
    <h2>Meine Gegenstände</h2>
        <div>
            <input v-model="newItem" placeholder="Neuen Gegenstand eingeben" />
            <button @click="addItem">Hinzufügen</button>
        </div>
  </section>
</template>
