<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleTheme"
    :class="buttonClass"
  >
    <ClientOnly>
      <Icon
        :name="$colorMode.value === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'"
        :class="iconClass || 'h-5 w-5 text-gray-700 dark:text-gray-300'"
      />
    </ClientOnly>
  </Button>
</template>

<script setup lang="ts">
interface Props {
  buttonClass?: string
  iconClass?: string
}

defineProps<Props>()

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script> 