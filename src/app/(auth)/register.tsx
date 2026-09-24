import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen/KeyboardAwareScreen';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

import {
    getPasswordStrength,
    isValidEmail,
    isValidPassword,
} from '../../utils/validation';

// Register ekran omogućava korisniku da kreira novi NutriPlan nalog.
// Podaci se za sada proveravaju lokalno, dok ćemo kasnije povezati
// formu sa postojećim NutriPlan backend-om.

export default function RegisterScreen() {
    // Vrednosti koje korisnik unosi u formu.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Poruka o grešci koja se prikazuje nakon pokušaja slanja forme.
    const [error, setError] = useState('');

    // Određuje trenutnu jačinu lozinke dok je korisnik unosi.
    const passwordStrength = getPasswordStrength(password);

    // Proverava podatke forme pre pokušaja registracije.
    // Za sada uspešna validacija vodi na Home ekran.
    // Kasnije će ovde biti poziv backend API-ja.
    const handleRegister = () => {
        setError('');

        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError('Molimo vas popunite sva polja.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Unesite ispravnu email adresu.');
            return;
        }

        if (!isValidPassword(password)) {
            setError(
                'Lozinka mora imati najmanje 8 karaktera, jedno veliko slovo, jedan broj i jedan specijalni karakter.'
            );
            return;
        }

        if (password !== confirmPassword) {
            setError('Lozinke se ne podudaraju.');
            return;
        }

        // Privremeno ponašanje dok ne povežemo backend.
        router.replace('/(tabs)/home');
    };

    // Vraća korisnika na Login ekran ukoliko već ima nalog.
    const handleLogin = () => {
        router.replace('/(auth)/login');
    };

return (
    <KeyboardAwareScreen>
        <View style={styles.container}>
            {/* Naziv aplikacije */}
            <Text style={styles.title}>NutriPlan</Text>

            {/* Naslov Register ekrana */}
            <Text style={styles.subtitle}>
                Kreiraj svoj nalog
            </Text>

            {/* Polje za ime */}
            <Input
                placeholder="Ime"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
            />

            {/* Polje za email */}
            <Input
                placeholder="Email"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Polje za lozinku */}
            <Input
                placeholder="Lozinka"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Prikaz trenutne jačine lozinke */}
            {passwordStrength ? (
                <Text
                    style={[
                        styles.passwordStrength,
                        passwordStrength === 'weak' &&
                            styles.passwordWeak,
                        passwordStrength === 'medium' &&
                            styles.passwordMedium,
                        passwordStrength === 'strong' &&
                            styles.passwordStrong,
                    ]}
                >
                    Jačina lozinke:{' '}
                    {passwordStrength === 'weak'
                        ? 'Slabo'
                        : passwordStrength === 'medium'
                            ? 'Srednje'
                            : 'Dobro'}
                </Text>
            ) : null}

            {/* Polje za potvrdu lozinke */}
            <Input
                placeholder="Potvrdi lozinku"
                placeholderTextColor={COLORS.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            {/* Poruka o grešci */}
            {error ? (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            ) : null}

            {/* Dugme za registraciju */}
            <Button
                title="Registruj se"
                onPress={handleRegister}
            />

            {/* Link za prelazak na Login ekran */}
            <Pressable onPress={handleLogin}>
                <Text style={styles.loginText}>
                    Već imate nalog? Prijavite se
                </Text>
            </Pressable>
        </View>
    </KeyboardAwareScreen>
);

}

// Stilovi specifični za Register ekran.
// Zajedničke vrednosti preuzimamo iz našeg styles foldera.
const styles = StyleSheet.create({
    // Glavni kontejner Register ekrana.
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

    // Osnovni stil indikatora jačine lozinke.
    passwordStrength: {
        width: '100%',
        marginTop: -SPACING.sm,
        marginBottom: SPACING.md,
        fontSize: TYPOGRAPHY.bodySmall,
    },

    // Slaba lozinka.
    passwordWeak: {
        color: COLORS.error,
    },

    // Srednje jaka lozinka.
    passwordMedium: {
        color: COLORS.warning,
    },

    // Dobra lozinka.
    passwordStrong: {
        color: COLORS.success,
    },

    // Poruka koja obaveštava korisnika o grešci u formi.
    errorText: {
        width: '100%',
        marginBottom: SPACING.md,
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.error,
    },

    // Link za prelazak na Login ekran.
    loginText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.primary,
        marginTop: SPACING.md,
    },
});