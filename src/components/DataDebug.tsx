"use client";

import { useExpenses, useIncome } from "@/hooks/useRealtimeData";
import { supabase } from "@/lib/supabaseClient";

export default function DataDebug() {
  const {
    data: expenses,
    loading: expensesLoading,
    error: expensesError,
  } = useExpenses();
  const {
    data: income,
    loading: incomeLoading,
    error: incomeError,
  } = useIncome();

  const testConnection = async () => {
    try {
      // console.log("Testing Supabase connection...");
      const { data, error } = await supabase
        .from("expenses")
        .select("count")
        .limit(1);
      // console.log("Supabase test result:", { data, error });
    } catch (err) {
      console.error("Supabase connection error:", err);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-4">Debug Information</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-green-300">Environment Variables:</h4>
          <p className="text-sm text-gray-300">
            SUPABASE_URL:{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
          </p>
          <p className="text-sm text-gray-300">
            SUPABASE_ANON_KEY:{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? "✅ Set"
              : "❌ Missing"}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-green-300">Expenses Data:</h4>
          <p className="text-sm text-gray-300">
            Loading: {expensesLoading ? "Yes" : "No"}
          </p>
          <p className="text-sm text-gray-300">
            Count: {expenses?.length || 0}
          </p>
          <p className="text-sm text-gray-300">
            Error: {expensesError || "None"}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-green-300">Income Data:</h4>
          <p className="text-sm text-gray-300">
            Loading: {incomeLoading ? "Yes" : "No"}
          </p>
          <p className="text-sm text-gray-300">Count: {income?.length || 0}</p>
          <p className="text-sm text-gray-300">
            Error: {incomeError || "None"}
          </p>
        </div>

        <button
          onClick={testConnection}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Test Supabase Connection
        </button>
      </div>
    </div>
  );
}
