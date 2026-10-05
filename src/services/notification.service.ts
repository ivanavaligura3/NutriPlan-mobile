import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  return status === "granted";
};

// Ključ pod kojim čuvamo podešavanje obaveštenja.
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";

// Čitanje trenutnog podešavanja obaveštenja.
export const getNotificationsEnabled = async () => {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);

  // Ako podešavanje još nije sačuvano,
  // podrazumevano su uključena.
  if (value === null) {
    return true;
  }

  return value === "true";
};

// Čuvanje podešavanja obaveštenja.
export const setNotificationsEnabled = async (enabled: boolean) => {
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
};

const MEAL_REMINDERS_ENABLED_KEY = "meal_reminders_enabled";

// Čitanje podešavanja podsetnika za obroke.
export const getMealRemindersEnabled = async () => {
  const value = await AsyncStorage.getItem(MEAL_REMINDERS_ENABLED_KEY);

  // Podsetnici su podrazumevano uključeni.
  if (value === null) {
    return true;
  }

  return value === "true";
};

// Čuvanje podešavanja podsetnika za obroke.
export const setMealRemindersEnabled = async (enabled: boolean) => {
  await AsyncStorage.setItem(MEAL_REMINDERS_ENABLED_KEY, String(enabled));
};

// Zakazuje testno lokalno obaveštenje.
// Koristimo ga za proveru da li lokalne notifikacije
// pravilno rade na Development Build-u.
export const scheduleTestNotification = async () => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Svoja 🍎",
      body: "Test lokalnog obaveštenja je uspešan!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
    },
  });

  return notificationId;
};

// Zakazuje podsetnik za planirani obrok.
export const scheduleMealReminder = async (mealName: string, date: Date) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Svoja 🍎",
      body: `Vreme je za obrok: ${mealName}.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });

  return notificationId;
};
