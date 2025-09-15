"use client";

import { useExpenses, useIncome } from "@/hooks/useRealtimeData";
import { useMemo, useState, useCallback } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import ExpenseChart from "./charts/ExpenseChart";
import IncomeChart from "./charts/IncomeChart";
import TestChart from "./charts/TestChart";
import DataDebug from "./DataDebug";
import SimpleChart from "./SimpleChart";

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  expenseCount: number;
  incomeCount: number;
}

type TabType = "overview" | "expenses" | "income";

export default function RealtimeDashboard() {
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
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Debug logging
  // // console.log("RealtimeDashboard - expenses:", expenses);
  // // console.log("RealtimeDashboard - income:", income);
  // // console.log("RealtimeDashboard - expensesLoading:", expensesLoading);
  // // console.log("RealtimeDashboard - incomeLoading:", incomeLoading);
  // // console.log("RealtimeDashboard - expensesError:", expensesError);
  // // console.log("RealtimeDashboard - incomeError:", incomeError);

  // Calculate current month data
  const currentMonth = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const monthlyExpenses =
      expenses?.filter((expense: any) => {
        const expenseDate = new Date(expense.created_at);
        return expenseDate >= start && expenseDate <= end;
      }) || [];

    const monthlyIncome =
      income?.filter((incomeItem: any) => {
        const incomeDate = new Date(incomeItem.date);
        return incomeDate >= start && incomeDate <= end;
      }) || [];

    return {
      expenses: monthlyExpenses,
      income: monthlyIncome,
      totalExpenses: monthlyExpenses.reduce(
        (sum: number, e: any) => sum + Number(e.amount),
        0
      ),
      totalIncome: monthlyIncome.reduce(
        (sum: number, i: any) => sum + Number(i.amount),
        0
      ),
    };
  }, [expenses, income]);

  const summary: Summary = useMemo(() => {
    const totalIncome =
      income?.reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0;
    const totalExpenses =
      expenses?.reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;
    const netSavings = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      monthlyIncome: currentMonth.totalIncome,
      monthlyExpenses: currentMonth.totalExpenses,
      monthlySavings: currentMonth.totalIncome - currentMonth.totalExpenses,
      expenseCount: expenses?.length || 0,
      incomeCount: income?.length || 0,
    };
  }, [expenses, income, currentMonth]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  if (expensesLoading || incomeLoading) {
    return (
      <div className="text-white w-full max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-600 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white w-full space-y-4 sm:space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Financial Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Real-time financial insights and analytics
          </p>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live data</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-gray-800/50 p-1 rounded-lg w-full sm:w-fit">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "expenses", label: "Expenses", icon: "💸" },
          { id: "income", label: "Income", icon: "💰" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <span className="mr-1 sm:mr-2">{tab.icon}</span>
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* <SimpleChart /> */}
          {/* <DataDebug /> */}
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-green-600/20 p-4 sm:p-6 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-green-300">
                    Total Income
                  </h3>
                  <p className="text-lg sm:text-2xl font-bold text-green-100 truncate">
                    ₹{summary.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl sm:text-3xl ml-2">💰</div>
              </div>
              <p className="text-xs text-green-400 mt-2 truncate">
                This month: ₹{summary.monthlyIncome.toLocaleString()}
              </p>
            </div>

            <div className="bg-red-600/20 p-4 sm:p-6 rounded-lg border border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-red-300">
                    Total Expenses
                  </h3>
                  <p className="text-lg sm:text-2xl font-bold text-red-100 truncate">
                    ₹{summary.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl sm:text-3xl ml-2">💸</div>
              </div>
              <p className="text-xs text-red-400 mt-2 truncate">
                This month: ₹{summary.monthlyExpenses.toLocaleString()}
              </p>
            </div>

            <div
              className={`${
                summary.netSavings >= 0
                  ? "bg-blue-600/20 border-blue-500/30"
                  : "bg-orange-600/20 border-orange-500/30"
              } p-4 sm:p-6 rounded-lg border`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-blue-300">
                    Net Savings
                  </h3>
                  <p
                    className={`text-lg sm:text-2xl font-bold ${
                      summary.netSavings >= 0
                        ? "text-blue-100"
                        : "text-orange-100"
                    } truncate`}
                  >
                    ₹{summary.netSavings.toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl sm:text-3xl ml-2">
                  {summary.netSavings >= 0 ? "📈" : "📉"}
                </div>
              </div>
              <p className="text-xs text-blue-400 mt-2 truncate">
                This month: ₹{summary.monthlySavings.toLocaleString()}
              </p>
            </div>

            <div className="bg-purple-600/20 p-4 sm:p-6 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-purple-300">
                    Transactions
                  </h3>
                  <p className="text-lg sm:text-2xl font-bold text-purple-100">
                    {summary.expenseCount + summary.incomeCount}
                  </p>
                </div>
                <div className="text-2xl sm:text-3xl ml-2">📋</div>
              </div>
              <p className="text-xs text-purple-400 mt-2 truncate">
                {summary.expenseCount} expenses, {summary.incomeCount} income
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">
                📈 This Month's Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Income</span>
                  <span className="text-green-400 font-medium">
                    ₹{summary.monthlyIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Expenses</span>
                  <span className="text-red-400 font-medium">
                    ₹{summary.monthlyExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      Net Result
                    </span>
                    <span
                      className={`font-bold ${
                        summary.monthlySavings >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      ₹{summary.monthlySavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">
                🎯 Financial Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Savings Rate</span>
                  <span
                    className={`font-medium ${
                      summary.totalIncome > 0
                        ? (summary.netSavings / summary.totalIncome) * 100 >= 20
                          ? "text-green-400"
                          : "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    {summary.totalIncome > 0
                      ? `${(
                          (summary.netSavings / summary.totalIncome) *
                          100
                        ).toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Expense Ratio</span>
                  <span
                    className={`font-medium ${
                      summary.totalIncome > 0
                        ? (summary.totalExpenses / summary.totalIncome) * 100 <=
                          80
                          ? "text-green-400"
                          : "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {summary.totalIncome > 0
                      ? `${(
                          (summary.totalExpenses / summary.totalIncome) *
                          100
                        ).toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status</span>
                  <span
                    className={`font-medium ${
                      summary.netSavings >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {summary.netSavings >= 0 ? "Positive" : "Negative"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-6">
          {/* <TestChart /> */}
          <ExpenseChart
            expenses={(expenses as any) || []}
            loading={expensesLoading}
          />
        </div>
      )}

      {/* Income Tab */}
      {activeTab === "income" && (
        <div className="space-y-6">
          {/* <TestChart /> */}
          <IncomeChart income={(income as any) || []} loading={incomeLoading} />
        </div>
      )}
    </div>
  );
}
