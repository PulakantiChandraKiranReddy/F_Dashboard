"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay, subMonths } from "date-fns";

interface IncomeData {
  id: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
  user_id: string;
}

interface IncomeChartProps {
  income: IncomeData[];
  loading?: boolean;
}

const COLORS = [
  "#10B981",
  "#3B82F6", 
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

export default function IncomeChart({ income, loading }: IncomeChartProps) {
  // Process data for monthly income chart (last 12 months)
  const monthlyData = useMemo(() => {
    if (!income || income.length === 0) return [];

    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, 'MMM yyyy'),
        fullDate: startOfDay(date).toISOString(),
        amount: 0,
      };
    }).reverse();

    // Group income by month
    income.forEach(incomeItem => {
      const incomeDate = startOfDay(new Date(incomeItem.date)).toISOString();
      const monthData = last12Months.find(month => 
        month.fullDate.startsWith(incomeDate.substring(0, 7))
      );
      if (monthData) {
        monthData.amount += Number(incomeItem.amount);
      }
    });

    return last12Months;
  }, [income]);

  // Process data for source breakdown
  const sourceData = useMemo(() => {
    if (!income || income.length === 0) return [];

    const sourceTotals = income.reduce((acc, incomeItem) => {
      const source = incomeItem.source || 'Other';
      acc[source] = (acc[source] || 0) + Number(incomeItem.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceTotals)
      .map(([source, amount]) => ({ source, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 sources
  }, [income]);

  // Calculate total income
  const totalIncome = useMemo(() => {
    return income?.reduce((sum, incomeItem) => sum + Number(incomeItem.amount), 0) || 0;
  }, [income]);

  // Calculate average monthly income
  const avgMonthlyIncome = useMemo(() => {
    const monthsWithData = monthlyData.filter(month => month.amount > 0);
    if (monthsWithData.length === 0) return 0;
    return monthsWithData.reduce((sum, month) => sum + month.amount, 0) / monthsWithData.length;
  }, [monthlyData]);

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
        <div className="bg-green-600/20 p-3 sm:p-4 rounded-lg border border-green-500/30">
          <h3 className="text-xs sm:text-sm font-medium text-green-300">Total Income</h3>
          <p className="text-lg sm:text-2xl font-bold text-green-100 truncate">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-blue-600/20 p-3 sm:p-4 rounded-lg border border-blue-500/30">
          <h3 className="text-xs sm:text-sm font-medium text-blue-300">Avg Monthly</h3>
          <p className="text-lg sm:text-2xl font-bold text-blue-100 truncate">₹{avgMonthlyIncome.toLocaleString()}</p>
        </div>
        <div className="bg-purple-600/20 p-3 sm:p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-xs sm:text-sm font-medium text-purple-300">Sources</h3>
          <p className="text-lg sm:text-2xl font-bold text-purple-100">{sourceData.length}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Area Chart - Monthly Income Trend */}
                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">📈 Monthly Income Trend</h3>
                  <div className="chart-container">
                    <AreaChart
                      width={400}
                      height={300}
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Income']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
          </div>
        </div>

                {/* Pie Chart - Income Sources */}
                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">💰 Income Sources</h3>
                  <div className="chart-container">
                    <PieChart width={400} height={300}>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ source, percent }: any) =>
                          `${source} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#10B981"
                        dataKey="amount"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

      {/* Recent Income Table */}
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">📋 Recent Income</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2 text-gray-300">Date</th>
                <th className="text-left py-2 text-gray-300">Source</th>
                <th className="text-left py-2 text-gray-300">Description</th>
                <th className="text-right py-2 text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {income?.slice(0, 10).map((incomeItem) => (
                <tr key={incomeItem.id} className="border-b border-gray-700/50">
                  <td className="py-2 text-gray-400">
                    {format(new Date(incomeItem.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-2 text-white">{incomeItem.source}</td>
                  <td className="py-2 text-gray-400">
                    {incomeItem.description || 'No description'}
                  </td>
                  <td className="py-2 text-right text-green-300 font-medium">
                    +₹{Number(incomeItem.amount).toLocaleString()}
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
