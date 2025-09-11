"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Header() {
  const pathname = usePathname();
  const username = "Chandu"; // 👈 replace with state / auth later
  // const supabase = createClientComponentClient();
  // const [username, setUsername] = useState<string | null>(null);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (user) {
  //       // use email, or user_metadata.full_name if you set it during signup
  //       setUsername(user.user_metadata?.full_name || user.email);
  //     }
  //   };

  //   getUser();
  // }, [supabase]);

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3">
        {/* App name & user */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-white">
          <h1 className="text-lg sm:text-xl font-bold">Expense Tracker</h1>
          <span className="text-sm sm:text-base opacity-80">
            Hi, {username}
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-2 sm:mt-0">
          {pathname === "/dashboard" ? (
            <Link
              href="/admin"
              className="text-white hover:text-gray-300 text-sm sm:text-base"
            >
              Admin
            </Link>
          ) : pathname === "/admin" ? (
            <Link
              href="/dashboard"
              className="text-white hover:text-gray-300 text-sm sm:text-base"
            >
              Dashboard
            </Link>
          ) : null}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token"); // or clear cookie
            window.location.href = "/login";
          }}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
