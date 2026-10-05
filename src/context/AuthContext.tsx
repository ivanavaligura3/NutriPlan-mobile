import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, updateCurrentUser } from "../services/api";

import { getToken } from "../services/auth.service";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (
    first_name: string,
    last_name: string,
    email: string,
  ) => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const data = await getCurrentUser();

      setUser(data.user);
    } catch (error) {
      console.error("Greška pri proveri autentifikacije:", error);

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    first_name: string,
    last_name: string,
    email: string,
  ) => {
    const data = await updateCurrentUser(first_name, last_name, email);

    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refreshUser: checkAuthentication,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth mora biti korišćen unutar AuthProvider-a.");
  }

  return context;
}
