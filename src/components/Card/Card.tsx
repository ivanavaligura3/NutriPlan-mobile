import { ReactNode } from 'react';
import { View } from 'react-native'; 

import { styles } from './Card.styles';

// Reusable Card komponenta za prikaz različitih sadržaja
// u odvojenim vizuelnim celinama kroz aplikaciju.

type CardProps = {
    children: ReactNode;
};

export default function Card({ children }: CardProps) {
    return (
        <View style={styles.card}>
            {children}
        </View>
    );
}



