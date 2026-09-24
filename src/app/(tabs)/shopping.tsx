import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';

import { useShopping } from '../../context/ShoppingContext';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

import { router } from 'expo-router';

export default function ShoppingScreen() {
    const { items, togglePurchased, removeItem } = useShopping();
    const itemsToBuy = items.filter(
        (item) => !item.isPurchased
    );
    const purchasedItems = items.filter(
        (item) => item.isPurchased 
    );
    const handleDeleteItem = (itemId: number) => {
        Alert.alert(
            'Obriši stavku',
            'Da li ste sigurni da želite da uklonite ovu stavku sa liste za kupovinu?',
            [
                {
                    text: 'Otkaži',
                    style: 'cancel',
                },
                {
                    text: 'Obriši',
                    style: 'destructive',
                    onPress: () => removeItem(itemId),
                },
            ]
        );
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>
                Lista za kupovinu
            </Text>

            <Text style={styles.subtitle}>
                Namirnice koje je potrebno kupiti.
            </Text>

            <Pressable
                style={styles.addButton}
                onPress={() => router.push('/add-shopping-item')}
            >
                <Text style={styles.addButtonText}>
                    + Dodaj stavku
                </Text>
            </Pressable>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>
                    🛒 Za kupovinu
                </Text>

                {itemsToBuy.map((item) => (
                    <View
                        key={item.id}
                        style={[
                            styles.item,
                            item.isPurchased && styles.purchasedItem,
                        ]}
                    >
                        <View style={styles.nameRow}>
                            <Text
                                style={[
                                    styles.itemName,
                                    item.isPurchased && styles.purchasedText,
                                ]}
                            >
                                {item.name}
                            </Text>

                            <Pressable
                                style={[
                                    styles.checkbox,
                                    item.isPurchased && styles.checkboxChecked,
                                ]}
                                onPress={() => togglePurchased(item.id)}
                            >
                                {item.isPurchased && (
                                    <Text style={styles.checkmark}>
                                        ✓
                                    </Text>
                                )}
                            </Pressable>
                        </View>

                        <Text
                            style={[
                                styles.quantity,
                                item.isPurchased && styles.purchasedText,
                            ]}
                        >
                            {item.quantity} {item.unit}
                        </Text>

                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleDeleteItem(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>
                                Obriši
                            </Text>
                        </Pressable>
                    </View>
                ))}
            </View>

            <View style={styles.purchasedListContainer}>
                <Text style={styles.sectionTitle}>
                    ✅ Kupljeno
                </Text>

                {purchasedItems.map((item) => (
                    <View 
                        key={item.id} 
                        style={[ 
                            styles.item, styles.purchasedItem,
                        ]}
                    >
                        <View style={styles.nameRow}>
                            <Text 
                                style={[
                                    styles.itemName,
                                    styles.purchasedText,
                                ]}
                            >
                                {item.name}
                            </Text>

                            <Pressable
                                style={[
                                    styles.checkbox,
                                    styles.checkboxChecked,
                                ]}
                                onPress={() => togglePurchased(item.id)}
                            >
                                <Text style={styles.checkmark}>
                                    ✓
                                </Text>
                            </Pressable>
                        </View>

                        <Text 
                            style={[
                                styles.quantity,
                                styles.purchasedText,
                            ]}
                        >
                            {item.quantity} {item.unit}
                        </Text>

                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleDeleteItem(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>
                                Obriši
                            </Text>
                        </Pressable>
                    </View>   
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xxl,
    },

    title: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },

    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },

    sectionTitle: {
        fontSize: TYPOGRAPHY.headingSmall,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    listContainer: {
        gap: SPACING.md,
    },

    purchasedListContainer: {
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },

    item: {
        padding: SPACING.md,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },

    purchasedItem: {
        backgroundColor: COLORS.surface,
    },

    itemName: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },

    purchasedText: {
        color: COLORS.textSecondary,
        textDecorationLine: 'line-through',
    },

    quantity: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },

    deleteButton: {
        marginTop: SPACING.md,
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        backgroundColor: COLORS.error,
    },

    deleteButtonText: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: '600',
        color: COLORS.white,
    },

    addButton: {
        width: '100%',
        paddingVertical: SPACING.md,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginBottom: SPACING.xl,
    },

    addButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.white,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkboxChecked: {
        backgroundColor: COLORS.primary,
    },

    checkmark: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
});