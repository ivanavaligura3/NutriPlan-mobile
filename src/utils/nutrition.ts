// =====================================================
// POMOĆNE FUNKCIJE ZA NUTRITIVNE VREDNOSTI
// =====================================================

// Zaokruživanje nutritivne vrednosti na najbliži ceo broj.
// Precizna vrednost se i dalje koristi za računanje,
// a ova funkcija služi samo za prikaz korisniku.

export const roundNutrition = (value: number): number => {
  return Math.round(value);
};
