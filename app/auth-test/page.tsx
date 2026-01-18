"use client";

import { useAuth } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, User, Mail, Shield } from "lucide-react";

export default function AuthTestPage() {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono animate-pulse">
          <Terminal className="h-8 w-8 animate-spin" />
          <p className="mt-2">$ loading auth state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Terminal className="h-8 w-8 text-green-400" />
            <h1 className="text-2xl font-mono text-green-400">root@edos-shield: ~/auth-test</h1>
          </div>
          <p className="text-green-600 font-mono"># Testing JWT Authentication System</p>
        </div>

        <Card className="bg-gray-900 border-green-500/30 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-400 font-mono">
              <Shield className="h-5 w-5" />
              <span>Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant={isAuthenticated ? "default" : "destructive"}
                className={`font-mono ${
                  isAuthenticated
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                STATUS: {isAuthenticated ? "AUTHENTICATED" : "UNAUTHENTICATED"}
              </Badge>
            </div>

            {isAuthenticated && user && (
              <div className="space-y-3 p-4 bg-black/50 rounded border border-green-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-green-400" />
                      <span className="text-green-600 font-mono">USER_ID:</span>
                      <span className="text-white font-mono text-xs">{user.id}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-green-400" />
                      <span className="text-green-600 font-mono">EMAIL:</span>
                      <span className="text-white font-mono">{user.email}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-green-400" />
                      <span className="text-green-600 font-mono">USERNAME:</span>
                      <span className="text-white font-mono">
                        {user.username || user.user_metadata?.full_name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-green-600 font-mono">ROLE:</span>
                      <span className="text-white font-mono">{user.role || "user"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={signOut}
                    variant="destructive"
                    className="w-full font-mono bg-red-600 hover:bg-red-500"
                  >
                    $ ./logout --force
                  </Button>

                  <div className="text-center">
                    <p className="text-green-600 font-mono text-xs"># Click logout to test session termination</p>
                  </div>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                <p className="text-red-300 font-mono text-center"># No active session detected</p>
                <p className="text-red-400 font-mono text-center text-sm mt-2">
                  Please authenticate to access the system
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Information */}
        {isAuthenticated && (
          <Card className="bg-gray-900 border-green-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">Token Information</CardTitle>
              <CardDescription className="text-green-600 font-mono"># JWT Tokens stored in localStorage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-green-400 font-mono text-sm mb-2">Access Token (first 50 chars):</p>
                <p className="bg-black p-3 rounded text-xs text-green-300 font-mono break-all">
                  {localStorage.getItem("accessToken")?.substring(0, 50)}...
                </p>
              </div>
              <div>
                <p className="text-green-400 font-mono text-sm mb-2">Refresh Token Exists:</p>
                <p className="bg-black p-3 rounded text-xs text-green-300 font-mono">
                  {localStorage.getItem("refreshToken") ? "✓ Yes" : "✗ No"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
