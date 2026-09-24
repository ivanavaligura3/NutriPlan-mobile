import { StyleSheet, Text, View } from 'react-native';

import Button from '../../components/Button/Button';

import { logout } from '../../services/auth/auth.service';

import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

// Profile ekran prikazuje osnovne informacije o korisniku
// i omogućava odjavljivanje iz aplikacije.

export default function ProfileScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.container}>
                Profil
            </Text>

            <Text style={styles.description}>
                Ovde će se kasnije prikazivati podaci o korisniku.
            </Text>

            <Button
                title="Odjavi se"
                onPress={logout}
            />
        </View>
    );
}

const styles  = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.background,
    },

    title: {
        fontSize: TYPOGRAPHY.headingLarge,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },

    description: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },
});