import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import Button from "../../components/Button/Button";
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import { createProfileStyles } from "../../components/Profile/Profile.styles";
import UnitSelector from "../../components/UnitSelector/UnitSelector";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

import { logout } from "../../services/auth.service";
import {
  getMealRemindersEnabled,
  getNotificationsEnabled,
  requestNotificationPermission,
  setMealRemindersEnabled,
  setNotificationsEnabled,
} from "../../services/notification.service";
import {
  changePassword,
  deleteAccount,
  getUserStatistics,
  UserStatistics,
} from "../../services/user.service";

// Profile ekran prikazuje osnovne informacije o korisniku,
// omogućava izmenu podataka i podešavanje aplikacije.

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const { themeMode, setThemeMode, colors } = useTheme();
  const { t } = useLanguage();

  const styles = createProfileStyles(colors);

  const [isEditing, setIsEditing] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [mealRemindersEnabled, setMealRemindersEnabledState] = useState(true);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // =====================================================
  // UČITAVANJE PODATAKA KORISNIKA
  // =====================================================

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
    }
  }, [user]);

  // =====================================================
  // UČITAVANJE PODEŠAVANJA OBAVEŠTENJA
  // =====================================================

  useEffect(() => {
    const loadNotificationSettings = async () => {
      const notificationsEnabled = await getNotificationsEnabled();
      const mealRemindersEnabled = await getMealRemindersEnabled();

      setNotificationsEnabledState(notificationsEnabled);
      setMealRemindersEnabledState(mealRemindersEnabled);
    };

    loadNotificationSettings();
  }, []);

  // =====================================================
  // UČITAVANJE STATISTIKE KORISNIKA
  // =====================================================

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await getUserStatistics();

        setStatistics(data);
      } catch (error) {
        console.error("Greška pri učitavanju statistike:", error);
      }
    };

    loadStatistics();
  }, []);

  // =====================================================
  // INICIJALI KORISNIKA
  // =====================================================

  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
    : "";

  // =====================================================
  // ODJAVLJIVANJE KORISNIKA
  // =====================================================

  const handleLogout = () => {
    Alert.alert(t.profile.logoutTitle, t.profile.logoutMessage, [
      {
        text: t.profile.logoutCancel,
        style: "cancel",
      },
      {
        text: t.profile.logout,
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  // =====================================================
  // ČUVANJE IZMENA PROFILA
  // =====================================================

  const handleSaveProfile = async () => {
    try {
      await updateUser(firstName.trim(), lastName.trim(), email.trim());

      setIsEditing(false);

      Alert.alert(t.profile.success, t.profile.profileUpdated);
    } catch (error) {
      Alert.alert(
        t.profile.error,
        error instanceof Error ? error.message : t.profile.profileUpdateError,
      );
    }
  };

  // =====================================================
  // PROMENA LOZINKE
  // =====================================================

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t.profile.error, "Molimo unesite sva polja.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        t.profile.error,
        "Nova lozinka i potvrda lozinke se ne podudaraju.",
      );
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);

      Alert.alert(t.profile.success, "Lozinka je uspešno promenjena.");
    } catch (error) {
      Alert.alert(
        t.profile.error,
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri promeni lozinke.",
      );
    }
  };

  // =====================================================
  // BRISANJE NALOGA
  // =====================================================

  const handleDeleteAccount = () => {
    Alert.alert(
      "Brisanje naloga",
      "Da li ste sigurni da želite da obrišete nalog? Ova radnja je trajna i svi vaši podaci će biti obrisani.",
      [
        {
          text: "Otkaži",
          style: "cancel",
        },
        {
          text: "Obriši nalog",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();

              Alert.alert(
                "Nalog obrisan",
                "Vaš nalog i svi povezani podaci su uspešno obrisani.",
                [
                  {
                    text: "U redu",
                    onPress: logout,
                  },
                ],
              );
            } catch (error) {
              Alert.alert(
                t.profile.error,
                error instanceof Error
                  ? error.message
                  : "Došlo je do greške pri brisanju naloga.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =====================================================
            NASLOV
        ===================================================== */}

        <Text style={styles.title}>{t.profile.title}</Text>

        {/* =====================================================
            PROFIL
        ===================================================== */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={t.profile.firstName}
                  placeholderTextColor={colors.textSecondary}
                />

                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={t.profile.lastName}
                  placeholderTextColor={colors.textSecondary}
                />

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t.profile.email}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            ) : (
              <>
                <Text style={styles.profileName}>
                  {user?.first_name} {user?.last_name}
                </Text>

                <Text style={styles.profileDescription}>{user?.email}</Text>
              </>
            )}
          </View>
        </View>

        {/* =====================================================
            IZMENA PROFILA
        ===================================================== */}

        {!isEditing ? (
          <Pressable
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>{t.profile.editProfile}</Text>
          </Pressable>
        ) : (
          <View style={styles.editActions}>
            <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>{t.profile.saveChanges}</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>{t.profile.cancel}</Text>
            </Pressable>
          </View>
        )}

        {/* =====================================================
            OBAVEŠTENJA
        ===================================================== */}

        <Text style={styles.sectionTitle}>{t.profile.notifications}</Text>

        <View style={styles.settingsCard}>
          {/* OBAVEŠTENJA APLIKACIJE */}

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.profile.notifications}</Text>

              <Text style={styles.settingDescription}>
                {t.profile.enableNotifications}
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                if (value) {
                  const granted = await requestNotificationPermission();

                  if (!granted) {
                    setNotificationsEnabledState(false);
                    return;
                  }
                }

                setNotificationsEnabledState(value);

                await setNotificationsEnabled(value);
              }}
            />
          </View>

          <View style={styles.divider} />

          {/* PODSETNICI ZA OBROKE */}

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.profile.mealReminders}</Text>

              <Text style={styles.settingDescription}>
                {t.profile.mealRemindersDescription}
              </Text>
            </View>

            <Switch
              value={mealRemindersEnabled}
              disabled={!notificationsEnabled}
              onValueChange={async (value) => {
                setMealRemindersEnabledState(value);

                await setMealRemindersEnabled(value);
              }}
            />
          </View>
        </View>

        {/* =====================================================
            MOJA STATISTIKA
        ===================================================== */}

        <Text style={styles.sectionTitle}>{t.profile.statistics}</Text>

        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{statistics?.recipes ?? 0}</Text>

              <Text style={styles.statLabel}>{t.profile.recipes}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {statistics?.plannedMeals ?? 0}
              </Text>

              <Text style={styles.statLabel}>{t.profile.plannedMeals}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {statistics?.completedMeals ?? 0}
              </Text>

              <Text style={styles.statLabel}>{t.profile.completedMeals}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{statistics?.foods ?? 0}</Text>

              <Text style={styles.statLabel}>{t.profile.foods}</Text>
            </View>
          </View>
        </View>

        {/* =====================================================
            PODEŠAVANJA APLIKACIJE
        ===================================================== */}

        <Text style={styles.sectionTitle}>{t.profile.appSettings}</Text>

        <View style={styles.settingsCard}>
          {/* IZGLED APLIKACIJE */}

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.profile.appearance}</Text>

              <Text style={styles.settingDescription}>
                {t.profile.appearanceDescription}
              </Text>
            </View>

            <Switch
              value={themeMode === "dark"}
              onValueChange={(value) => {
                setThemeMode(value ? "dark" : "light");
              }}
            />
          </View>

          <View style={styles.divider} />

          {/* JEZIK */}

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.profile.language}</Text>

              <Text style={styles.settingDescription}>
                {t.profile.languageDescription}
              </Text>
            </View>

            <LanguageSelector />
          </View>

          <View style={styles.divider} />

          {/* JEDINICE MERE */}

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t.profile.units}</Text>

              <Text style={styles.settingDescription}>
                {t.profile.unitsDescription}
              </Text>
            </View>

            <UnitSelector />
          </View>
        </View>

        {/* =====================================================
            NALOG
        ===================================================== */}

        <Text style={styles.sectionTitle}>{t.profile.account}</Text>

        <View style={styles.accountCard}>
          {!isChangingPassword ? (
            <>
              <Pressable
                style={styles.accountButton}
                onPress={() => setIsChangingPassword(true)}
              >
                <Text style={styles.accountButtonText}>
                  {t.profile.changePassword}
                </Text>
              </Pressable>

              <View style={styles.divider} />
            </>
          ) : (
            <View style={styles.passwordForm}>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Trenutna lozinka"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nova lozinka"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Potvrdi novu lozinku"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />

              <View style={styles.passwordActions}>
                <Pressable
                  style={styles.saveButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.saveButtonText}>Promeni lozinku</Text>
                </Pressable>

                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Otkaži</Text>
                </Pressable>
              </View>

              <View style={styles.divider} />
            </View>
          )}

          <Pressable style={styles.accountButton} onPress={handleDeleteAccount}>
            <Text style={[styles.accountButtonText, styles.deleteAccountText]}>
              {t.profile.deleteAccount}
            </Text>
          </Pressable>
        </View>

        {/* =====================================================
            ODJAVA
        ===================================================== */}

        <View style={styles.logoutButton}>
          <Button title={t.profile.logout} onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}
