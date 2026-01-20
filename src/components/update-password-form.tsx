"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  // Use state to keep the client stable across renders
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        // 1. Check existing session
        const { data: { session } } = await supabase.auth.getSession();

        if (session && mounted) {
          setHasSession(true);
          setIsSessionChecking(false);
          return;
        }

        // 2. Fallback: Parse hash manually if session not found but hash exists (Implicit Flow)
        if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && data.session && mounted) {
              setHasSession(true);
              setIsSessionChecking(false);
              return;
            }
          }
        }

        // 3. Listen for auth changes (final fallback)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session && mounted) {
            setHasSession(true);
            setIsSessionChecking(false);
          }
        });

        // Set timeout to stop "verifying" if nothing happens
        setTimeout(() => {
          if (mounted && isSessionChecking) {
            setIsSessionChecking(false);
          }
        }, 4000);

        return () => {
          subscription.unsubscribe();
        };

      } catch (err) {
        console.error("Session check failed", err);
        if (mounted) setIsSessionChecking(false);
      }
    };

    initializeSession();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Final check before action
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Try one last time to force parse hash if present
      if (window.location.hash && window.location.hash.includes('access_token')) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) {
            setError("Session expired or invalid. Please request a new reset link.");
            setIsLoading(false);
            return;
          }
        }
      } else {
        setError("Session missing. Please request a new reset link.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSessionChecking) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground animate-pulse">Verifying secure link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {!hasSession && !isLoading && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  Link may be expired. Try
                  <button type="button" onClick={() => window.location.reload()} className="underline ml-1 font-medium">refreshing</button>
                  or request a new link.
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading || (!hasSession && !window.location.hash)}>
                {isLoading ? "Saving..." : "Save new password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
