// src/app/api/summary/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type SummaryResponse = {
  totalIncome: number;
  totalBorrowed: number;
  totalExpenses: number;
  netSavings: number;
};

export async function GET(req: Request) {
  const supabase = supabaseServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const filters = (q: any) => {
    if (from) q.gte("date", from);
    if (to) q.lte("date", to);
    return q;
  };

  const { data: incomeRows, error: incomeError } = await filters(
    supabase.from("income").select("amount, type").eq("user_id", user.id)
  );

  const { data: expenseRows, error: expenseError } = await filters(
    supabase.from("expenses").select("amount").eq("user_id", user.id)
  );

  if (incomeError || expenseError) {
    return NextResponse.json(
      { error: incomeError?.message || expenseError?.message },
      { status: 500 }
    );
  }

  let totalIncome = 0;
  let totalBorrowed = 0;
  type IncomeRow = {
    type: string;
    amount: number;
  };

  incomeRows?.forEach((i: IncomeRow) => {
    if (i.type === "borrowed") {
      totalBorrowed += i.amount;
    } else {
      totalIncome += i.amount;
    }
  });

  type ExpenseRow = {
    type: string;
    amount: number;
  };
  const totalExpenses =
    expenseRows?.reduce((sum: number, e: ExpenseRow) => sum + e.amount, 0) ?? 0;

  const netSavings = totalIncome + totalBorrowed - totalExpenses;

  const response: SummaryResponse = {
    totalIncome,
    totalBorrowed,
    totalExpenses,
    netSavings,
  };

  return NextResponse.json(response);
}
