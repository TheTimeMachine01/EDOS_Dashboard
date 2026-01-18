"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api-client";
import { USER_ROUTES, AUTH_ROUTES } from "@/lib/apiRoutes";

interface User {
  id: number;
  name: string;
  email: string;
  roles?: Array<{
    id: number;
    name: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (loginResponse: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decodes JWT token payload without verification (client-side only)
 * For security-critical operations, always validate on the backend
 */
function decodeJwt(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Checks if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, convert to milliseconds
  return Date.now() >= decoded.exp * 1000;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      console.log("[AUTH] Fetching current user...");
      // Use the centralized route constant
      const response = await api.get(USER_ROUTES.GET_CURRENT_USER);
      console.log("[AUTH] User fetched successfully:", response.data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("[AUTH] Failed to fetch current user:", error);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[AUTH] Initializing authentication...");
      const accessToken = localStorage.getItem("accessToken");
      console.log("[AUTH] Token exists:", !!accessToken);
      
      if (accessToken) {
        // Check if token is expired
        if (isTokenExpired(accessToken)) {
          console.log("[AUTH] Token expired, attempting refresh...");
          // Try to refresh
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const response = await api.post(AUTH_ROUTES.REFRESH_TOKEN, {
                refreshToken,
              });
              
              console.log("[AUTH] Token refreshed successfully");
              localStorage.setItem("accessToken", response.data.accessToken);
              if (response.data.refreshToken) {
                localStorage.setItem("refreshToken", response.data.refreshToken);
              }
              
              await fetchCurrentUser();
            } catch (error) {
              console.error("[AUTH] Token refresh failed:", error);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              setLoading(false);
            }
          } else {
            console.log("[AUTH] No refresh token available");
            setLoading(false);
          }
        } else {
          // Token is still valid, fetch user
          console.log("[AUTH] Token valid, fetching user...");
          await fetchCurrentUser();
        }
      } else {
        console.log("[AUTH] No token found, user not authenticated");
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (loginResponse: any) => {
    console.log("[AUTH] Logging in user, storing tokens...");
    // loginResponse should contain: { accessToken, refreshToken, user? }
    localStorage.setItem("accessToken", loginResponse.accessToken);
    localStorage.setItem("refreshToken", loginResponse.refreshToken);

    // Fetch full user data from backend
    console.log("[AUTH] Fetching current user...");
    await fetchCurrentUser();
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Optional: Call your backend logout endpoint if implemented
      // This can be used to blacklist tokens on the server
      // await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error (non-blocking):", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
