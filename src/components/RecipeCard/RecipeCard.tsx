import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";

import { useRecipes } from "../../context/RecipeContext";
import { Recipe } from "../../types/recipe";
import { styles } from "./RecipeCard.styles";

import { COLORS } from "../../styles/colors";
import { roundNutrition } from "../../utils/nutrition";

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { removeRecipe, favoriteRecipeIds, toggleFavorite } = useRecipes();

  const handleDelete = () => {
    Alert.alert(
      "Obriši recept",
      "Da li ste sigurni da želite da obrišete ovaj recept?",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Obriši",
          style: "destructive",
          onPress: async () => {
            try {
              await removeRecipe(recipe.id);

              Alert.alert("Uspešno brisanje", "Recept je uspešno obrisan.");
            } catch (error) {
              Alert.alert(
                "Greška",
                error instanceof Error
                  ? error.message
                  : "Došlo je do greške pri brisanju recepta.",
              );
            }
          },
        },
      ],
    );
  };

  const isFavorite = favoriteRecipeIds.includes(recipe.id);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(recipe.id);
    } catch (error) {
      Alert.alert(
        "Greška",
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri promeni favorita.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.recipeInfo}
          onPress={() =>
            router.push({
              pathname: "/recipe-details",
              params: {
                recipeId: recipe.id.toString(),
              },
            })
          }
        >
          <Text style={styles.name}>{recipe.name}</Text>

          <Text style={styles.description}>{recipe.description}</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.info}>
              {roundNutrition(recipe.calories)} kcal
            </Text>

            <Text style={styles.info}>{recipe.preparationTime} min</Text>
          </View>
        </Pressable>

        <Pressable style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={26}
            color={COLORS.primary}
          />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={handleDelete}>
          <Text style={styles.deleteText}>Obriši</Text>
        </Pressable>
      </View>
    </View>
  );
}
