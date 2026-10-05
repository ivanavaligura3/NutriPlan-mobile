import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";
import { useEffect } from "react";

import { useShopping } from "../../context/ShoppingContext";

import { getDateString } from "../../constants/dateData";

import { COLORS } from "../../styles/colors";
import { SPACING } from "../../styles/spacing";
import { TYPOGRAPHY } from "../../styles/typography";

import { useUnits } from "../../context/UnitContext";
import { formatQuantityForDisplay } from "../../utils/unitConversion";

export default function ShoppingScreen() {
  const { items, syncAutomaticItems, togglePurchased, removeItem } =
    useShopping();

  const { unitSystem } = useUnits();
  const getDisplayQuantity = (quantity: number, unit: string) => {
    return formatQuantityForDisplay(quantity, unit, unitSystem);
  };

  // =====================================================
  // TRENUTNI DATUM
  // =====================================================

  const today = new Date();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Datum u formatu YYYY-MM-DD.
  const todayDate = getDateString(todayYear, todayMonth, todayDay);

  // =====================================================
  // SINHRONIZACIJA AUTOMATSKIH STAVKI
  // =====================================================

  useEffect(() => {
    const synchronizeShoppingList = async () => {
      try {
        await syncAutomaticItems(todayDate);
      } catch (error) {
        console.error("Greška pri sinhronizaciji shopping liste:", error);
      }
    };

    synchronizeShoppingList();
  }, [todayDate, syncAutomaticItems]);

  // =====================================================
  // STAVKE KOJE TREBA KUPITI
  // =====================================================

  const itemsToBuy = items.filter((item) => !item.isPurchased);

  // =====================================================
  // KUPLJENE STAVKE
  // =====================================================

  const purchasedItems = items.filter((item) => item.isPurchased);

  // =====================================================
  // BRISANJE STAVKE
  // =====================================================

  const handleDeleteItem = (itemId: number) => {
    Alert.alert(
      "Obriši stavku",
      "Da li ste sigurni da želite da uklonite ovu stavku sa liste za kupovinu?",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Obriši",
          style: "destructive",
          onPress: () => removeItem(itemId),
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista za kupovinu</Text>

      <Text style={styles.subtitle}>Namirnice koje je potrebno kupiti.</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/add-shopping-item")}
      >
        <Text style={styles.addButtonText}>+ Dodaj stavku</Text>
      </Pressable>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>🛒 Za kupovinu</Text>

        {/* Sve stavke koje još nisu kupljene. */}
        {itemsToBuy.map((item) => (
          <View
            key={item.id}
            style={[styles.item, item.isPurchased && styles.purchasedItem]}
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

              {item.isAutomatic && (
                <Text style={styles.automaticLabel}>Iz plana</Text>
              )}

              <Pressable
                style={[
                  styles.checkbox,
                  item.isPurchased && styles.checkboxChecked,
                ]}
                onPress={() => togglePurchased(item.id)}
              >
                {item.isPurchased && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            </View>

            <Text
              style={[
                styles.quantity,
                item.isPurchased && styles.purchasedText,
              ]}
            >
              {getDisplayQuantity(item.quantity, item.unit).quantity}{" "}
              {getDisplayQuantity(item.quantity, item.unit).unit}
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={styles.deleteButtonText}>Obriši</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.purchasedListContainer}>
        <Text style={styles.sectionTitle}>✅ Kupljeno</Text>

        {purchasedItems.map((item) => (
          <View key={item.id} style={[styles.item, styles.purchasedItem]}>
            <View style={styles.nameRow}>
              <Text style={[styles.itemName, styles.purchasedText]}>
                {item.name}
              </Text>

              <Pressable
                style={[styles.checkbox, styles.checkboxChecked]}
                onPress={() => togglePurchased(item.id)}
              >
                <Text style={styles.checkmark}>✓</Text>
              </Pressable>
            </View>

            <Text style={[styles.quantity, styles.purchasedText]}>
              {getDisplayQuantity(item.quantity, item.unit).quantity}{" "}
              {getDisplayQuantity(item.quantity, item.unit).unit}
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={styles.deleteButtonText}>Obriši</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.xl,
  },

  title: {
    fontSize: TYPOGRAPHY.headingLarge,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.headingSmall,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  listContainer: {
    marginBottom: SPACING.xl,
  },

  purchasedListContainer: {
    marginBottom: SPACING.xl,
  },

  item: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  purchasedItem: {
    opacity: 0.65,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemName: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
    marginRight: SPACING.sm,
  },

  purchasedText: {
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },

  quantity: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  deleteButton: {
    alignSelf: "flex-end",
    marginTop: SPACING.sm,
  },

  deleteButtonText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    color: COLORS.error,
  },

  addButton: {
    width: "100%",
    paddingVertical: SPACING.md,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },

  addButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.white,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },

  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  automaticLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },
});
