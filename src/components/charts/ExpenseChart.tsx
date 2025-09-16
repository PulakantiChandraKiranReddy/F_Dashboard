"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface ExpenseData {
  id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
  notes?: string;
  user_id: string;
}

interface ExpenseChartProps {
  expenses: ExpenseData[];
  loading?: boolean;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function ExpenseChart({ expenses, loading }: ExpenseChartProps) {
  // Debug logging
  // console.log("ExpenseChart - expenses:", expenses);
  // console.log("ExpenseChart - loading:", loading);

  // Process data for line chart (last 30 days)
  const lineChartData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      // console.log("No expenses data available");
      return [];
    }

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, "MMM dd"),
        fullDate: startOfDay(date).toISOString(),
        amount: 0,
      };
    }).reverse();

    // Group expenses by date
    expenses.forEach((expense) => {
      const expenseDate = startOfDay(
        new Date(expense.created_at)
      ).toISOString();
      const dayData = last30Days.find((day) => day.fullDate === expenseDate);
      if (dayData) {
        dayData.amount += Number(expense.amount);
      }
    });

    // console.log("Processed line chart data:", last30Days);
    return last30Days;
  }, [expenses]);

  // Process data for pie chart (categories)
  const pieChartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || "Other";
      acc[category] = (acc[category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: COLORS[index % COLORS.length],
    }));
  }, [expenses]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return (
      expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0
    );
  }, [expenses]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-red-600/20 p-3 sm:p-4 rounded-lg border border-red-500/30">
          <h3 className="text-xs sm:text-sm font-medium text-red-300">
            Total Expenses
          </h3>
          <p className="text-lg sm:text-2xl font-bold text-red-100 truncate">
            ₹{totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-600/20 p-3 sm:p-4 rounded-lg border border-blue-500/30">
          <h3 className="text-xs sm:text-sm font-medium text-blue-300">
            This Month
          </h3>
          <p className="text-lg sm:text-2xl font-bold text-blue-100 truncate">
            ₹
            {lineChartData
              .slice(-30)
              .reduce((sum, day) => sum + day.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-green-600/20 p-3 sm:p-4 rounded-lg border border-green-500/30">
          <h3 className="text-xs sm:text-sm font-medium text-green-300">
            Categories
          </h3>
          <p className="text-lg sm:text-2xl font-bold text-green-100">
            {pieChartData.length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Line Chart - Spending Trend */}
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
            📈 Spending Trend (30 Days)
          </h3>
          <div className="chart-container">
            <LineChart
              width={400}
              height={300}
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  "Amount",
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2 }}
              />
            </LineChart>
          </div>
        </div>

        {/* Pie Chart - Category Breakdown */}
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
            🥧 Category Breakdown
          </h3>
          <div className="chart-container">
            <PieChart width={400} height={300}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  "Amount",
                ]}
              />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
          📋 Recent Expenses
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2 text-gray-300">Date</th>
                <th className="text-left py-2 text-gray-300 hidden sm:table-cell">
                  Title
                </th>
                <th className="text-left py-2 text-gray-300">Category</th>
                <th className="text-right py-2 text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* {expenses
                ?.sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )
                .slice(0, 10)
                .map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700/50">
                    <td className="py-2 text-gray-400">
                      <div className="text-xs">
                        {format(new Date(expense.created_at), "MMM dd")}
                      </div>
                    </td>
                    <td className="py-2 text-white hidden sm:table-cell truncate max-w-32">
                      {expense.title}
                    </td>
                    <td className="py-2">
                      <span className="px-1.5 sm:px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-2 text-right text-red-300 font-medium text-xs sm:text-sm">
                      -₹{Number(expense.amount).toLocaleString()}
                    </td>
                  </tr>
                ))} */}
              {expenses
                ?.sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .slice(0, 10)
                .map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700/50">
                    <td className="py-2 text-gray-400">
                      <div className="text-xs">
                        {format(new Date(expense.created_at), "MMM dd")}
                      </div>
                    </td>
                    <td className="py-2 text-white hidden sm:table-cell truncate max-w-32">
                      {expense.title}
                    </td>
                    <td className="py-2">
                      <span className="px-1.5 sm:px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-2 text-right text-red-300 font-medium text-xs sm:text-sm">
                      -₹{Number(expense.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
