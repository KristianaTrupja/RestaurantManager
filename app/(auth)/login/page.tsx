"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock } from "lucide-react";
import { useLoginMutation } from "@/app/lib/api/authApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setCredentials } from "@/app/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth);

  // Extract table number from username (e.g., "table1" -> 1)
  const extractTableNumber = (username: string): number | null => {
    const match = username.toLowerCase().match(/^table(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && token) {
      const tableNumber = extractTableNumber(user.username || "");
      if (user.role === "GUEST" && tableNumber !== null) {
        // Table guest - auto-assign
        handleTableGuestLogin(user.id, tableNumber, token);
      } else {
        redirectBasedOnRole(user.role);
      }
    }
  }, [isAuthenticated, user, token]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "GUEST":
        // Generic guests still go to choose-table
        router.push("/choose-table");
        break;
      case "WAITER":
        router.push("/waiter-dashboard");
        break;
      case "ADMIN":
        router.push("/admin-dashboard");
        break;
      default:
        toast.error("Unknown role");
    }
  };

  const handleTableGuestLogin = async (
    userId: number,
    tableNumber: number,
    authToken: string
  ): Promise<void> => {
    try {
      console.log(`[TableGuest] Starting auto-assignment for table ${tableNumber}`);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      
      // Fetch all tables
      const tablesResult = await fetch(`${apiUrl}/tables`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!tablesResult.ok) {
        console.error(`[TableGuest] Failed to fetch tables: ${tablesResult.status}`);
        toast.error("Failed to load tables");
        return;
      }

      const tablesData = await tablesResult.json();
      
      if (!tablesData.success || !tablesData.data) {
        console.error("[TableGuest] Invalid tables response");
        toast.error("Failed to load tables");
        return;
      }

      // Find table with matching number
      const table = tablesData.data.find(
        (t: { tableNumber?: number; number?: number }) => {
          const tNum = t.tableNumber ?? t.number;
          return tNum === tableNumber;
        }
      );

      if (!table) {
        console.error(`[TableGuest] Table ${tableNumber} not found`);
        toast.error(`Table ${tableNumber} not found`);
        return;
      }

      console.log(`[TableGuest] Found table:`, table);

      // Check if table already has an active session (using currentSessionId from table data)
      if (table.currentSessionId) {
        console.log(`[TableGuest] Table has existing session: ${table.currentSessionId}`);
        toast.success(`Welcome back to Table ${tableNumber}!`);
        router.push(`/dashboard?tableId=${table.id}&sessionId=${table.currentSessionId}&tableNumber=${tableNumber}`);
        return;
      }

      // No existing session - check if table is free
      const status = table.status?.toLowerCase();
      if (status !== "free" && status !== "available") {
        console.log(`[TableGuest] Table ${tableNumber} is ${status} but has no session`);
        toast.error(`Table ${tableNumber} is currently unavailable`);
        return;
      }

      // Start new session for this table
      console.log(`[TableGuest] Starting new session for table ${table.id}`);
      const sessionResult = await fetch(`${apiUrl}/sessions/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId: table.id,
          guestId: userId,
        }),
      });

      if (!sessionResult.ok) {
        const errorText = await sessionResult.text();
        console.error(`[TableGuest] Session start failed: ${sessionResult.status}`, errorText);
        toast.error("Failed to start session");
        return;
      }

      const sessionData = await sessionResult.json();
      console.log("[TableGuest] New session data:", sessionData);

      if (sessionData.success && sessionData.data) {
        toast.success(`Welcome to Table ${tableNumber}!`);
        router.push(`/dashboard?tableId=${table.id}&sessionId=${sessionData.data.id}&tableNumber=${tableNumber}`);
      } else {
        console.error("[TableGuest] Session creation failed:", sessionData);
        toast.error(sessionData.message || "Failed to start session");
      }
    } catch (error) {
      console.error("[TableGuest] Error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ username, password }).unwrap();
      
      if (result.success && result.data) {
        // Set cookies for middleware
        await fetch("/api/set-auth-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: result.data.token,
            user: result.data.user,
          }),
        });

        // Set credentials in Redux store
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token,
        }));
        
        const loggedInUser = result.data.user;
        const inputUsername = username.toLowerCase();
        const tableNumber = extractTableNumber(inputUsername);

        console.log(`[Login] User: ${loggedInUser.username}, Role: ${loggedInUser.role}, TableNumber: ${tableNumber}`);

        // If this is a table guest (e.g., table1, table2), auto-assign to that table
        if (loggedInUser.role === "GUEST" && tableNumber !== null) {
          await handleTableGuestLogin(
            loggedInUser.id,
            tableNumber,
            result.data.token
          );
        } else {
          // Regular login flow
          toast.success(result.message || "Login successful!");
          redirectBasedOnRole(loggedInUser.role);
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; error?: string };
      toast.error(err.data?.message || err.error || "Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ulliri</h1>
          <p className="text-zinc-300 text-sm">Restaurant Order System</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="frosted-glass bg-[rgba(255,255,255,0.1)] p-8 rounded-3xl space-y-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
            <p className="text-zinc-400 text-sm mt-1">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (e.g., table1)"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="purple"
            size="lg"
            className="w-full mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </span>
            )}
          </Button>
          
          {/* Help text */}
          <p className="text-center text-zinc-500 text-xs mt-4">
            Table guests: Login as table1, table2, etc.
          </p>
        </form>
      </div>
    </div>
  );
}
