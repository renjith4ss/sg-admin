<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { currentUser, logout } = useAuth()
</script>

<template>
  <div class="container py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <Button variant="outline" @click="logout">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Logout
      </Button>
    </div>
    
    <div class="grid gap-4">
      <div class="p-6 bg-card text-card-foreground rounded-lg border shadow-sm">
        <h2 class="text-lg font-semibold mb-2">Welcome Back</h2>
        <p class="text-muted-foreground">
          Logged in as: {{ currentUser?.email }}
        </p>
      </div>
    </div>
  </div>
</template> 