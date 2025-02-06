<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import type { CreateRoleInput, Role } from '~/types/role';

const props = defineProps<{
  initialData?: Role
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'submit', data: CreateRoleInput): void
  (e: 'cancel'): void
}>()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    permissions: z.array(z.string())
  })
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.initialData?.name ?? '',
    description: props.initialData?.description ?? '',
    permissions: props.initialData?.permissions ?? []
  }
})

const onSubmit = form.handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <FormField
      v-slot="{ field }"
      name="name"
    >
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input v-bind="field" placeholder="Enter role name" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ field }"
      name="description"
    >
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            v-bind="field"
            placeholder="Enter role description"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-end gap-2">
      <Button
        variant="outline"
        type="button"
        @click="emit('cancel')"
      >
        Cancel
      </Button>
      <Button type="submit">
        {{ mode === 'create' ? 'Create' : 'Update' }} Role
      </Button>
    </div>
  </form>
</template> 