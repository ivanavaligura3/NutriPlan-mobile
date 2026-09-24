import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen/KeyboardAwareScreen';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

import { isValidEmail } from '../../utils/validation';

// Login ekran omogućava korisniku da se prijavi na postojeći NutriPlan nalog.
// Podaci se za sada proveravaju lokalno, dok ćemo kasnije povezati
// formu sa postojećim NutriPlan backend-om.

export default function LoginScreen() {
    // Vrednosti koje korisnik unosi u formu.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Poruka o grešci koja se prikazuje korisniku kada podaci nisu ispravni.
    const [error, setError] = useState('');

    // Proverava podatke forme pre pokušaja prijave.
    // Za sada uspešna validacija vodi na Home ekran.
    // Kasnije će ovde biti poziv backend API-ja.
    const handleLogin = () => {
        setError('');

        if (!email.trim() || !password) {
            setError('Molimo vas popunite sva polja.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Unesite ispravnu email adresu.');
            return;
        }

        // Privremeno ponašanje dok ne povežemo backend.
        router.replace('/(tabs)/home');
    };

    // Otvara ekran za registraciju novog korisnika.
    const handleRegister = () => {
        router.push('/(auth)/register');
    };

    return (
        <KeyboardAwareScreen>
        <View style={styles.container}>
            {/* Naziv aplikacije */}
            <Text style={styles.title}>NutriPlan</Text>

            {/* Naslov Login ekrana */}
            <Text style={styles.subtitle}>
                Prijavi se na svoj nalog
            </Text>

            {/* Email polje */}
            <Input
                placeholder="Email"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Lozinka polje */}
            <Input
                placeholder="Lozinka"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Poruka o grešci */}
            {error ? (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            ) : null}

            {/* Dugme za prijavu */}
            <Button
                title="Prijavi se"
                onPress={handleLogin}
            />

            {/* Link za otvaranje ekrana za registraciju */}
            <Pressable onPress={handleRegister}>
                <Text style={styles.registerText}>
                    Nemate nalog? Registrujte se
                </Text>
            </Pressable>
        </View>
        </KeyboardAwareScreen>
    );
}

// Stilovi specifični za Login ekran.
// Zajedničke vrednosti preuzimamo iz našeg styles foldera.
const styles = StyleSheet.create({
    // Glavni kontejner Login ekrana.
    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },

    // Glavni naziv aplikacije.
    title: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },

    // Tekst koji opisuje svrhu ekrana.
    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
    },

    // Poruka koja obaveštava korisnika o grešci u formi.
    errorText: {
        width: '100%',
        marginBottom: SPACING.md,
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.error,
    },

    // Link za otvaranje ekrana za registraciju.
    registerText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.primary,
        marginTop: SPACING.md,
    },
});