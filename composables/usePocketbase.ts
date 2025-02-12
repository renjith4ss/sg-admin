import { useState } from "#app";
import { useCookie } from "#imports";
import type { AuthModel, SendOptions } from "pocketbase"; // Import the correct type
import PocketBase from "pocketbase";

export const usePocketbase = () => {
  const config = useRuntimeConfig()
  
  // Create PocketBase instance only if we're in a proper Nuxt context
  const pb = new PocketBase(config.public.pocketbaseUrl)
  
  const user = useState<AuthModel | null>("user", () => null);
  const tokenCookie = useCookie<string | null>("pb_auth", {
    secure: true,
    sameSite: "strict",
    maxAge: 31536000, // 1 year
  });

  pb.authStore.onChange((token, model) => {
    user.value = model;
    tokenCookie.value = token || null;
  });

  const initialize = async () => {
    try {
      // Check if there's a token in the cookie
      const token = tokenCookie.value;
      if (token) {
        pb.authStore.save(token); // Important: Restore token to the auth store
        if (pb.authStore.isValid) {
          await pb.collection("_superusers").authRefresh();
          // Call your API here
          // await callProtectedApi(pb.authStore.token);
        }
      }
    } catch (error) {
      // Handle initialization errors, e.g., token expired
      console.error("Initialization error:", error);
      tokenCookie.value = null; // Clear invalid token
      pb.authStore.clear(); // Clear auth store
      user.value = null;
    }
  };

  const login = async (data: any) => {
    try {
      const authData = await pb
        .collection("_superusers")
        .authWithPassword(data.email, data.password);
      return authData;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw the error for component handling
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    tokenCookie.value = null;
    user.value = null;
  };

  const send = async (endpoint: string, options: SendOptions) => {
    return await pb.send(endpoint, options)
  }

  const refreshAuth = async () => {
    await pb.collection("_superusers").authRefresh();
  }

  return { pb, user, login, logout, initialize, send, refreshAuth };
};
