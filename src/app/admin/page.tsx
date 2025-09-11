"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ExpenseForm from "@/components/ExpensesForm";
import Terminal from "@/components/Terminal";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); // 👈 redirect if not logged in
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  //   return (
  //     <div className="font-sans flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
  //       {/* Header fixed height */}
  //       <div className="flex-shrink-0 ">
  //         <Header />
  //       </div>

  //       {/* Main content → takes full remaining height */}
  //       <div className="flex flex-1 w-full gap-6 p-5">
  //         {/* Expense Form → 40% */}
  //         <div className="w-2/5 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col overflow-auto">
  //           <ExpenseForm />
  //         </div>

  //         {/* Terminal → 60% */}
  //         <div className="w-3/5 bg-black rounded-xl shadow-lg p-4 flex flex-col overflow-hidden">
  //           <Terminal />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header → fixed height */}
      <div className="h-16 flex-shrink-0 p-5">
        <Header />
      </div>

      {/* Main content → fills remaining screen */}
      <div className="flex flex-1 w-full gap-6 p-5">
        {/* Expense Form → 40% */}
        <div className="w-2/5 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col overflow-auto">
          <ExpenseForm />
        </div>

        {/* Terminal → 60% */}
        <div className="w-3/5 bg-black rounded-xl shadow-lg p-4 flex flex-col overflow-hidden">
          <Terminal />
        </div>
      </div>
    </div>
  );
}
