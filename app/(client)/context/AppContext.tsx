import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { User } from "../_lib/interfaces";

interface AppContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (userData: User, token: string) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        profileImageUrl: userData.profileImageUrl,
        role: userData.role,
      })
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    Cookies.remove("token");
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...userData };

      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          profileImageUrl: updatedUser.profileImageUrl,
          role: updatedUser.role,
        })
      );

      return updatedUser;
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get("token");

        if (token) {
          try {
            const response = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              localStorage.removeItem("user");
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        } else {
          localStorage.removeItem("user");
          Cookies.remove("token");
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) initializeAuth();
  }, [user]);

  const contextValue: AppContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
