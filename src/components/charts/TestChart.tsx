// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const testData = [
//   { name: "Jan", value: 400 },
//   { name: "Feb", value: 300 },
//   { name: "Mar", value: 200 },
//   { name: "Apr", value: 278 },
//   { name: "May", value: 189 },
//   { name: "Jun", value: 239 },
// ];

// export default function TestChart() {
//   // console.log("TestChart rendering with data:", testData);

//   return (
//     <div className="bg-gray-800/50 p-6 rounded-lg">
//       <h3 className="text-lg font-semibold mb-4 text-white">Test Chart</h3>
//       <div className="chart-container">
//         <LineChart
//           width={400}
//           height={300}
//           data={testData}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//           <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
//           <YAxis stroke="#9CA3AF" fontSize={12} />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#1F2937",
//               border: "1px solid #374151",
//               borderRadius: "8px",
//               color: "#F9FAFB",
//             }}
//           />
//           <Line
//             type="monotone"
//             dataKey="value"
//             stroke="#8884d8"
//             strokeWidth={2}
//             dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </div>
//     </div>
//   );
// }
