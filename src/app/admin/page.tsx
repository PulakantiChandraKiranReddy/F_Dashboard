"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ExpenseForm from "@/components/ExpensesForm";
// import IncomeForm from "@/components/IncomeForm";
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
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-16 px-4 sm:px-8 py-8">
        {/* Main content → fills remaining screen */}
        <div className="flex flex-col xl:flex-row w-full gap-4 sm:gap-6 min-h-[calc(100vh-12rem)]">
          {/* Forms Section → 40% */}
          <div className="w-full xl:w-2/5 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 flex flex-col overflow-auto space-y-4 sm:space-y-6">
            <ExpenseForm />
            {/* <IncomeForm /> */}
          </div>

          {/* Terminal → 60% */}
          <div className="w-full xl:w-3/5 bg-black rounded-xl shadow-lg p-3 sm:p-4 flex flex-col overflow-hidden">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
}
