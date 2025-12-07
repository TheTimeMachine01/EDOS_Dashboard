// import ComingSoonPage from "@/components/coming-soon";

// export default function NetworkPage() {
//   return (
//     <ComingSoonPage
//       title="Network Traffic Analysis"
//       description="Advanced network traffic monitoring and deep packet inspection system. Analyze network patterns, detect anomalies, and identify potential DDoS attacks before they impact your infrastructure."
//       features={[
//         "Deep packet inspection",
//         "Traffic pattern analysis",
//         "Bandwidth utilization monitoring",
//         "Protocol distribution charts",
//         "Anomaly detection algorithms",
//         "Network topology mapping",
//       ]}
//       estimatedTime="Q1 2026"
//     />
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function NetworkPage() {
  // Initial dummy data
  const initialDummyData = [
    { time: "10:01:01", temp: 32.5 },
  { time: "10:01:02", temp: 32.8 },
  { time: "10:01:03", temp: 33.0 },
  { time: "10:01:04", temp: 33.4 },
  { time: "10:01:05", temp: 33.1 },
  { time: "10:01:06", temp: 33.8 },
  { time: "10:01:07", temp: 34.0 },
  { time: "10:01:08", temp: 33.7 },
  { time: "10:01:09", temp: 33.9 },
  { time: "10:01:10", temp: 34.2 },

  { time: "10:01:11", temp: 33.5 },
  { time: "10:01:12", temp: 32.9 },
  { time: "10:01:13", temp: 33.3 },
  { time: "10:01:14", temp: 34.1 },
  { time: "10:01:15", temp: 35.0 },
  { time: "10:01:16", temp: 34.6 },
  { time: "10:01:17", temp: 36.2 },
  { time: "10:01:18", temp: 35.4 },
  { time: "10:01:19", temp: 34.9 },
  { time: "10:01:20", temp: 36.5 },

  { time: "10:01:21", temp: 37.2 },
  { time: "10:01:22", temp: 36.9 },
  { time: "10:01:23", temp: 38.1 },
  { time: "10:01:24", temp: 37.4 },
  { time: "10:01:25", temp: 39.0 },
  { time: "10:01:26", temp: 38.2 },
  { time: "10:01:27", temp: 37.7 },
  { time: "10:01:28", temp: 36.8 },
  { time: "10:01:29", temp: 37.9 },
  { time: "10:01:30", temp: 38.6 },

  { time: "10:01:31", temp: 39.4 },
  { time: "10:01:32", temp: 38.8 },
  { time: "10:01:33", temp: 37.3 },
  { time: "10:01:34", temp: 36.9 },
  { time: "10:01:35", temp: 38.0 },
  { time: "10:01:36", temp: 39.2 },
  { time: "10:01:37", temp: 40.1 },
  { time: "10:01:38", temp: 38.7 },
  { time: "10:01:39", temp: 37.5 },
  { time: "10:01:40", temp: 39.3 },
  ];

  const [data, setData] = useState(initialDummyData);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry = {
        time: new Date().toLocaleTimeString(),
        temp: Number((30 + Math.random() * 10).toFixed(1)), // random 30–40°C
      };

      setData((prev) => {
        const updated = [...prev, newEntry];
        if (updated.length > 50) updated.shift(); // keep last 50 points
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "24px",
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
        📡 Network Traffic Analysis — Live Network Data Simulation
      </h1>

      <p style={{ marginBottom: "12px", opacity: 0.8 }}>
        Real-time data visualization panel. (Currently using dummy NetWork data as a live feed example.)
      </p>

      <div
        style={{
          background: "#0a0a0a",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #00c950",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>Live Network analysis Graph </h2>

        <div style={{ width: "100%", height: "380px" }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#cbd5e1" />
              <YAxis
                stroke="#cbd5e1"
                label={{
                  value: "UpTime",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#cbd5e1",
                }}
              />
              <Tooltip
                contentStyle={{ background: "#020617", borderRadius: "8px" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temp"
                name="DownTime"
                stroke="#c90000ff"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
