type DialogOptions = {
  title: string
  content: () => any
}

export const useDialog = () => {
  const isOpen = ref(false)
  const options = ref<DialogOptions | null>(null)

  const create = (dialogOptions: DialogOptions) => {
    options.value = dialogOptions
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    options.value = null
  }

  return {
    isOpen,
    options,
    create,
    close
  }
} 