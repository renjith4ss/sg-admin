<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-950 relative">
    <!-- Theme Toggle Button -->
    <div class="absolute top-4 right-4">
      <ThemeToggle buttonClass="rounded-full" />
    </div>

    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        class="bg-blue-500 dark:bg-blue-600 rounded-2xl overflow-hidden flex max-w-4xl w-full shadow-xl"
      >
        <!-- Left side with quote -->
        <div class="w-1/2 p-12 text-white flex flex-col">
          <div class="flex items-center gap-2 mb-8">
            <div
              class="w-10 h-10 rounded-lg bg-white flex items-center justify-center"
            >
              <span class="text-2xl w-8 h-8">
                <BrandLogoColor />
              </span>
            </div>
            <span class="text-2xl font-bold">Lumenex</span>
          </div>
          <div class="flex-1 flex items-center">
            <div class="space-y-4">
              <h2 class="text-3xl font-bold">Admin Portal</h2>
              <p class="text-blue-100 dark:text-blue-200">
                Sign in to access your admin dashboard and manage your
                resources.
              </p>
            </div>
          </div>
        </div>

        <!-- Right side with login form -->
        <div class="bg-white dark:bg-gray-900 w-1/2 p-12">
          <div class="flex items-center justify-between mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Sign in
            </h2>
          </div>

          <Form
            :validation-schema="formSchema"
            @submit="handleSubmit"
            class="space-y-6"
          >
            <div class="space-y-6">
              <FormField v-slot="{ field, errors }" name="email">
                <FormItem>
                  <FormLabel
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="field"
                      type="email"
                      autocomplete="email"
                      required
                      :disabled="isLoading"
                      placeholder="admin@example.com"
                      class="dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage v-if="errors" class="text-sm text-red-500">
                    {{ errors }}
                  </FormMessage>
                </FormItem>
              </FormField>

              <div class="space-y-2">
                <FormField v-slot="{ field, errors }" name="password">
                  <FormItem>
                    <FormLabel
                      class="text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        v-bind="field"
                        type="password"
                        required
                        autocomplete="current-password"
                        :disabled="isLoading"
                        placeholder="Enter your password"
                        class="dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage v-if="errors" class="text-sm text-red-500">
                      {{ errors }}
                    </FormMessage>
                  </FormItem>
                </FormField>

                <div class="flex items-center justify-end">
                  <Button
                    variant="link"
                    class="text-sm text-blue-500 hover:text-blue-600 p-0 h-auto dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>
            </div>

            <Alert
              v-if="error"
              variant="destructive"
              class="mb-6 dark:border-gray-800"
            >
              {{ error }}
            </Alert>

            <Button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              size="lg"
            >
              Login with Password
            </Button>
          </Form>
        </div>
      </div>
    </div>
    <p
      class="absolute bottom-4 w-full text-center text-gray-500 dark:text-gray-400"
    >
      © {{ new Date().getFullYear() }} lumenex.io. All rights reserved.
    </p>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";
import * as z from "zod";

definePageMeta({
  layout: "landing"
});

const formSchema = computed(() => {
  return toTypedSchema(
    z.object({
      email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must not exceed 50 characters"),
    })
  );
});

const error = ref<string | null>(null);
const isLoading = ref(false);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleSubmit(values: any) {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    error.value = null;
    const result = await authStore.login({
      email: values.email,
      password: values.password,
    });
    const redirect = route.query.redirect as string;
    router.push(redirect || "/");
  } catch (err: any) {
    error.value = err.message || "Failed to login";
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
}
</script>
