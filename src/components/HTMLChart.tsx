"use client";

export default function HTMLChart() {
  // console.log("HTMLChart rendering");

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
        HTML Test Chart (No Recharts)
      </h3>
      <div
        style={{
          width: "100%",
          height: "250px",
          position: "relative",
          backgroundColor: "#374151",
        }}
      >
        <svg width="100%" height="100%" style={{ border: "1px solid #6b7280" }}>
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#4b5563"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Simple line chart */}
          <polyline
            fill="none"
            stroke="#8884d8"
            strokeWidth="3"
            points="50,200 150,150 250,100 350,50"
          />

          {/* Data points */}
          <circle cx="50" cy="200" r="4" fill="#8884d8" />
          <circle cx="150" cy="150" r="4" fill="#8884d8" />
          <circle cx="250" cy="100" r="4" fill="#8884d8" />
          <circle cx="350" cy="50" r="4" fill="#8884d8" />

          {/* Labels */}
          <text x="50" y="220" fill="#9CA3AF" fontSize="12" textAnchor="middle">
            A
          </text>
          <text
            x="150"
            y="220"
            fill="#9CA3AF"
            fontSize="12"
            textAnchor="middle"
          >
            B
          </text>
          <text
            x="250"
            y="220"
            fill="#9CA3AF"
            fontSize="12"
            textAnchor="middle"
          >
            C
          </text>
          <text
            x="350"
            y="220"
            fill="#9CA3AF"
            fontSize="12"
            textAnchor="middle"
          >
            D
          </text>
        </svg>
      </div>
    </div>
  );
}
