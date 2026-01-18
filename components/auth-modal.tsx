"use client";

import { useState } from "react";
import { Shield, X, Loader2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-context";
import api from "@/lib/api-client";
import { AUTH_ROUTES } from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
}


export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        // Matches your Spring Boot LoginRequest DTO
        const response = await api.post(AUTH_ROUTES.LOGIN, { email, password });
        // Wait for login to complete (which fetches user data)
        await login(response.data);
        // Small delay to ensure auth context is updated
        await new Promise(resolve => setTimeout(resolve, 300));
        onClose();
        // Push after modal is closed and auth is updated
        router.push("/dashboard");
      } else {
        // Matches your Spring Boot RegistrationRequest DTO
        await api.post(AUTH_ROUTES.SIGNUP, { 
          email, 
          password, 
          username: username || email.split('@')[0] 
        });
        // After signup, switch to login mode
        onModeChange("login");
        setError("Account created. Please login.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-green-500/30 text-green-400 font-mono sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-green-500" />
            <DialogTitle className="text-xl font-bold uppercase tracking-wider">
              {mode === "login" ? "./auth --login" : "./auth --register"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="username">USERNAME</Label>
              <Input
                id="username"
                type="text"
                placeholder="security_admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black border-green-500/30 text-green-400 focus-visible:ring-green-500"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">EMAIL_ADDRESS</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@edos-shield.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-green-500/30 text-green-400 focus-visible:ring-green-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">ACCESS_KEY</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-green-500/30 text-green-400 focus-visible:ring-green-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-2 uppercase">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-green-500 text-black hover:bg-green-400 font-bold mt-4">
            {loading ? <Loader2 className="animate-spin mr-2" /> : mode === "login" ? "EXECUTE LOGIN" : "INITIALIZE ACCOUNT"}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
              className="text-xs text-gray-400 hover:text-green-400 underline transition-colors"
            >
              {mode === "login" ? "Create new credential?" : "Already have an account?"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}