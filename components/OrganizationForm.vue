<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useOrganizationsStore } from '~/stores/organization'
import type { Organization } from '~/types/organization'

const props = defineProps<{
  organization?: Organization | null
}>()

const emit = defineEmits<{
  close: []
}>()

const organizationStore = useOrganizationsStore()

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  owner: z.string().min(1, 'Owner is required'),
  status: z.enum(['active', 'inactive'])
})

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: props.organization?.name ?? '',
    description: props.organization?.description ?? '',
    owner: props.organization?.owner ?? '',
    status: props.organization?.status ?? 'active'
  }
})

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    if (props.organization) {
      await organizationStore.updateOrganization(props.organization.id, values)
    } else {
      await organizationStore.createOrganization(values)
    }
    emit('close')
  } catch (error) {
    console.error('Form submission error:', error)
  }
}
</script>

<template>
  <form @submit="form.handleSubmit(onSubmit)" class="space-y-4">
    <FormField
      v-slot="{ field }"
      :control="form"
      name="name"
    >
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ field }"
      :control="form"
      name="description"
    >
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ field }"
      :control="form"
      name="status"
    >
      <FormItem>
        <FormLabel>Status</FormLabel>
        <FormControl>
          <Select v-bind="field">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-end gap-2">
      <Button variant="outline" type="button" @click="emit('close')">
        Cancel
      </Button>
      <Button type="submit" :loading="organizationStore.isLoading">
        {{ props.organization ? 'Update' : 'Create' }}
      </Button>
    </div>
  </form>
</template> 