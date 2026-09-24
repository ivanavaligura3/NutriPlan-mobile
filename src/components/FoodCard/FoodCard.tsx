import { Text, TouchableOpacity, Pressable } from 'react-native';

import { Food } from '../../types/food';
import { styles } from './FoodCard.styles';

type FoodCardProps = {
    food: Food;
    onPress?: () => void;
    onDelete?: () => void;
};

export default function FoodCard({
    food,
    onPress,
    onDelete,
}: FoodCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.foodName}>
                {food.name}
            </Text>

            <Text style={styles.quantity}>
                {food.quantity} {food.unit}
            </Text>

            <Pressable 
                style={styles.deleteButton}
                onPress={onDelete}
            >
                <Text style={styles.deleteButtonText}>
                    Obriši
                </Text>
            </Pressable>
        </TouchableOpacity>
    );
}