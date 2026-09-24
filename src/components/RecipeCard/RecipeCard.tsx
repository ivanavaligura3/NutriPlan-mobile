import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Recipe } from '../../types/recipe';
import { styles } from './RecipeCard.styles';

type RecipeCardProps = {
    recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Pressable
            style={styles.container}
            onPress={() =>
                router.push({
                    pathname: '/recipe-details',
                    params: {
                        recipeId: recipe.id.toString(),
                    },
                })
            }
        >
            <Text style={styles.name}>
                {recipe.name}
            </Text>

            <Text style={styles.description}>
                {recipe.description}
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.info}>
                    {recipe.calories} kcal
                </Text>

                <Text style={styles.info}>
                    {recipe.preparationTime} min
                </Text>
            </View>
        </Pressable>
    );
}