import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Ključ pod kojim čuvamo JWT token na telefonu.
const TOKEN_KEY = "nutriplan_token";

// Čuvanje JWT tokena nakon uspešne prijave.
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

// Dohvatanje trenutno sačuvanog JWT tokena.
export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Brisanje JWT tokena prilikom odjavljivanja.
export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// Odjavljivanje korisnika.
export const logout = async () => {
  await removeToken();

  router.replace("/(auth)/login");
};
