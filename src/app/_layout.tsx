import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";
import { FoodProvider } from "../context/FoodContext";
import { LanguageProvider } from "../context/LanguageContext";
import { MealProvider } from "../context/MealContext";
import { RecipeProvider } from "../context/RecipeContext";
import { ShoppingProvider } from "../context/ShoppingContext";
import { ThemeProvider } from "../context/ThemeContext";
import { UnitProvider } from "../context/UnitContext";

// Glavni layout aplikacije.
// Provider komponente omogućavaju svim ekranima aplikacije
// pristup zajedničkim podacima i autentifikaciji korisnika.

export default function RootLayout() {
  return (
    <AuthProvider>
      <MealProvider>
        <RecipeProvider>
          <FoodProvider>
            <ShoppingProvider>
              <ThemeProvider>
                <LanguageProvider>
                  <UnitProvider>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen name="index" />
                      <Stack.Screen name="(tabs)" />
                    </Stack>
                  </UnitProvider>
                </LanguageProvider>
              </ThemeProvider>
            </ShoppingProvider>
          </FoodProvider>
        </RecipeProvider>
      </MealProvider>
    </AuthProvider>
  );
}
