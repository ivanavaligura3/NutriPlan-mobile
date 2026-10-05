import API_URL from "./api";
import { getToken } from "./auth.service";

// =====================================================
// TIP PODATAKA ZA STATISTIKU KORISNIKA
// =====================================================

export type UserStatistics = {
  recipes: number;
  plannedMeals: number;
  completedMeals: number;
  foods: number;
};

// =====================================================
// TIP PODATAKA ZA PROMENU LOZINKE
// =====================================================

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

// =====================================================
// DOHVATANJE STATISTIKE KORISNIKA
// =====================================================

export const getUserStatistics = async (): Promise<UserStatistics> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/users/statistics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Greška pri dohvatanju statistike korisnika.",
    );
  }

  return data.statistics;
};

// =====================================================
// PROMENA LOZINKE
// =====================================================

export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<void> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/users/change-password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Greška pri promeni lozinke.");
  }
};

// =====================================================
// BRISANJE NALOGA
// =====================================================

export const deleteAccount = async (): Promise<void> => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Greška pri brisanju naloga.");
  }
};
