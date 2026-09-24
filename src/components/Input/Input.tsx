import { TextInput, TextInputProps } from 'react-native';

import { styles } from './Input.styles';

// Reusable input komponenta koju koristimo kroz aplikaciju.
// Osnovne React Native TextInput osobine prosleđujemo kroz props,
// kako bi komponenta mogla da se koristi za različite tipove polja.

export default function Input(props: TextInputProps) {
    return (
        <TextInput 
            {...props}
            style={[styles.input, props.style]}
        />
    );
}
