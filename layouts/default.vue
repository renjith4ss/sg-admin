<template>
  <div class="layout-default">
    <header class="header">
      <!-- Add your header content -->
    </header>
    
    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <!-- Add your footer content -->
    </footer>
  </div>
</template>

<script setup lang="ts">
// Layout level logic can go here
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}
</style> 