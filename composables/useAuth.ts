import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export const useAuth = () => {
  const authStore = useAuthStore();
  const { isAuthenticated, isLoading, error, user, isTokenExpired } =
    storeToRefs(authStore);
  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  const startTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    refreshInterval = setInterval(async () => {
      if (isTokenExpired.value) {
        try {
          await authStore.refreshSession();
        } catch (err) {
          console.error("Token refresh failed:", err);
          await logout();
        }
      }
    }, 60 * 1000);
  };

  const nuxtApp = useNuxtApp();

  nuxtApp.hook("app:created", () => {
    if (isAuthenticated.value) {
      startTokenRefresh();
    }
    watch(isAuthenticated, (newValue: boolean) => {
      if (newValue) {
        startTokenRefresh();
      } else if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });
  });

  nuxtApp.hook("app:beforeMount", () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });

  const login = async (email: string, password: string) => {
    return await authStore.login({ email, password });
  };

  const logout = async () => {
    await authStore.logout();
    navigateTo("/login");
  };

  const requestPasswordReset = async (email: string) => {
    return await authStore.requestPasswordReset(email);
  };

  const confirmPasswordReset = async (token: string, password: string) => {
    return await authStore.confirmPasswordReset({
      token,
      password,
      passwordConfirm: password,
    });
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    user,
    isTokenExpired,

    // Actions
    login,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
  };
};
