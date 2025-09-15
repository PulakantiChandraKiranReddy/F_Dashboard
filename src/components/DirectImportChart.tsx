"use client";

// Try direct imports to see if there's an import issue
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "A", value: 100 },
  { name: "B", value: 200 },
  { name: "C", value: 300 },
];

export default function DirectImportChart() {
  // console.log("DirectImportChart rendering with data:", data);
  // console.log("Recharts components:", { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer });

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#1f2937",
        padding: "20px",
      }}
    >
      <h3 style={{ color: "white", marginBottom: "20px" }}>
        Direct Import Chart
      </h3>
      <div style={{ width: "100%", height: "250px", position: "relative" }}>
        <LineChart
          width={400}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
