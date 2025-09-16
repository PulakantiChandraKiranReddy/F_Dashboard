"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    const loadDisplayName = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // ✅ Fallback: use full_name from metadata, else prefix of email
        const fallbackName =
          user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

        setUsername(fallbackName);
      } catch (e) {
        console.error("Error loading user:", e);
      }
    };

    loadDisplayName();
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-transparent backdrop-blur-md border-b border-gray-700/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App name & user */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Balance
            </h1>
            <span className="hidden sm:inline text-sm text-gray-300">
              Hi, {username}
            </span>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav>
              {pathname === "/dashboard" ? (
                <Link
                  href="/admin"
                  className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200"
                >
                  Admin
                </Link>
              ) : pathname === "/admin" ? (
                <Link
                  href="/dashboard"
                  className="text-white hover:text-gray-300 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              ) : null}
            </nav>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="bg-red-600/90 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
