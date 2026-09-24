import {
    KeyboardAvoidingView,
    KeyboardAvoidingViewProps,
    Platform,
    ScrollView,
} from 'react-native';

import { styles } from './KeyboardAwareScreen.styles';

// Wrapper komponenta koja prilagođava sadržaj ekrana kada se
// pojavi tastatura i omogućava skrolovanje do polja koje korinik popunjava.
// Koristimo je na ekranima koji sadrže forme, kao što su Login i Register.

type KeyboardAwareScreenProps = KeyboardAvoidingViewProps & {
    children: React.ReactNode;
};

export default function KeyboardAwareScreen({
    children,
    ...props
}: KeyboardAwareScreenProps) {
    return (
        <KeyboardAvoidingView
            {...props}
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}