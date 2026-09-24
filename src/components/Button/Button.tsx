import { Pressable, PressableProps, StyleProp, Text, ViewStyle,} from 'react-native';

import { styles } from './Button.styles';

// Reusable Button komponenta za glavne akcije u aplikaciji.
// Omogućava da sva glavna dugmad imaju isti izgled,
// dok tekst i funkciju dugmeta određuje ekran koji ga koristi.

type ButtonProps = PressableProps & {
    title: string;
};

export default function Button({
    title,
    style,
    ...props
}: ButtonProps) {
    return (
        <Pressable
            {...props}
            style={[
                styles.button,
                style as StyleProp<ViewStyle>,
            ]}
        >
            <Text style={styles.buttonText}>
                {title}
            </Text>
        </Pressable>
    );
}