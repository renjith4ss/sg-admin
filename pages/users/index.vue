<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Users</h1>
    <div class="grid gap-4">
      <!-- User list will go here -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script> 