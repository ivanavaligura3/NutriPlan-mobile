// Osnovna URL adresa NutriPlan backend-a
import { getToken } from "./auth.service";

// Osnovna URL adresa NutriPlan backend-a
const API_URL = "http://10.48.107.47:5000/api";
console.log("API URL:", API_URL);

// Opšta funkcija za POST zahteve
const postRequest = async (endpoint: string, body: object) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return {
    response,
    data,
  };
};

// Test komunikacije sa backendom
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test`);

    const data = await response.json();

    console.log("Backend odgovor:", data);

    return data;
  } catch (error) {
    console.error("Greška pri povezivanju sa backendom:", error);

    throw error;
  }
};

// Registracija korisnika
export const registerUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
) => {
  const { response, data } = await postRequest("/users/register", {
    first_name,
    last_name,
    email,
    password,
  });

  if (!response.ok) {
    throw new Error(data.message || "Registracija nije uspela.");
  }

  return data;
};

// Prijava korisnika.
export const loginUser = async (email: string, password: string) => {
  const { response, data } = await postRequest("/users/login", {
    email,
    password,
  });

  if (!response.ok) {
    throw new Error(data.message || "Prijava nije uspela.");
  }

  return data;
};

// Dohvatanje trenutno prijavljenog korisnika.
export const getCurrentUser = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće dohvatiti podatke korisnika.");
  }

  return data;
};

// Izmena podataka trenutno prijavljenog korisnika.
export const updateCurrentUser = async (
  first_name: string,
  last_name: string,
  email: string,
) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Korisnik nije prijavljen.");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Nije moguće izmeniti podatke korisnika.");
  }

  return data;
};

export default API_URL;
