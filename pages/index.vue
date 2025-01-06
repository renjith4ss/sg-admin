<template>
  <div class="min-h-screen bg-background">
    <div class="container py-10">
      <h1 class="text-4xl font-bold mb-8 text-foreground">
        Welcome to {{ title }}
      </h1>
      <p class="text-lg mb-8 text-muted-foreground">
        Your Nuxt Application with Dark Mode Support
      </p>
      
      <div class="flex justify-center gap-4">
        <Button 
          @click="$colorMode.preference = 'light'"
          :variant="$colorMode.value === 'light' ? 'default' : 'secondary'"
        >
          Light Mode
        </Button>
        <Button 
          @click="$colorMode.preference = 'dark'"
          :variant="$colorMode.value === 'dark' ? 'default' : 'secondary'"
        >
          Dark Mode
        </Button>
        <Button 
          @click="$colorMode.preference = 'system'"
          variant="outline"
        >
          System
        </Button>
      </div>
      
      <p class="mt-4 text-sm text-muted-foreground">
        Current color mode: {{ $colorMode.preference }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '#components'

const title = ref('Nuxt App')
</script> 