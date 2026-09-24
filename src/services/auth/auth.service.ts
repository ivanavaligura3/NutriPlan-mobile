import { router } from 'expo-router';

// Servis kkoji sadrži funkcije vezane za autentifikaciju korisnika.
// Kasnije ćemo ovde dodati login, register, čuvanje tokena
// i proveru postojeće sesije.

// Odjavljivanje korisnika i vraćanje na login ekran.
// Za sada nema brisanja tokena jer autentifikacija još nije 
// povezana sa backendom.

export function logout() {
    router.replace('/(auth)/login');
}