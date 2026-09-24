import { Stack } from 'expo-router';

import { MealProvider } from '../context/MealContext';
import { RecipeProvider } from '../context/RecipeContext';
import { FoodProvider } from '../context/FoodContext';
import { ShoppingProvider } from '../context/ShoppingContext';

// Glavni layout aplikacije.
// Provider komponente omogućavaju svim ekranima aplikacije
// pristup zajedničkim podacima o obrocima i receptima.

export default function RootLayout() {
    return (
        <MealProvider>
            <RecipeProvider>
                <FoodProvider>
                    <ShoppingProvider>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                            }}
                        />
                    </ShoppingProvider>
                </FoodProvider>
            </RecipeProvider>
        </MealProvider>
    );
}