import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  isDefaultAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password?: string) => Promise<void>;
  registerAccount: (email: string, password?: string) => Promise<void>;
  signOut: () => void;
}

const DEFAULT_ADMIN: User = {
  id: "admin-default",
  name: "Default Admin",
  email: "admin@example.com",
  isDefaultAdmin: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_ADMIN);

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(DEFAULT_ADMIN);
    }
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (!password) {
       // Legacy mock fallback if password isn't passed from somewhere
       const newUser = { id: `user-${Date.now()}`, name: email.split("@")[0], email, isDefaultAdmin: false };
       setUser(newUser);
       localStorage.setItem("authUser", JSON.stringify(newUser));
       return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Failed to login");
    }

    const data = await res.json();
    const newUser = { ...data.user, isDefaultAdmin: false };
    
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    localStorage.setItem("authToken", data.token);
  };

  const registerAccount = async (email: string, password?: string) => {
    if (!password) throw new Error("Password required");
    
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to register");
    }

    const data = await res.json();
    const newUser = { ...data.user, isDefaultAdmin: false };
    
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    localStorage.setItem("authToken", data.token);
  };

  const signOut = () => {
    setUser(DEFAULT_ADMIN);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, registerAccount, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
